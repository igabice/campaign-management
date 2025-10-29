/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { SocialMedia } from "@prisma/client";
import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks?: string[];
  profile_picture?: string;
  link?: string;
}

interface FacebookPostResponse {
  id: string;
  post_id?: string;
}

class FacebookService {
  private readonly baseURL = "https://graph.facebook.com/v19.0";

  /**
   * Get long-lived access token from short-lived token
   */
  async getLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseURL}/oauth/access_token`, {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      });

      return response.data.access_token;
    } catch (error: any) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Failed to get long-lived token: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }

  /**
   * Get user's Facebook pages
   */
  async getUserPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const allPages: any[] = [];
      let url = `${this.baseURL}/me/accounts`;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axios.get(url, {
          params: {
            access_token: accessToken,
            fields: "id,name,access_token,category,tasks,picture{url},link",
            limit: 100, // Request more pages per call
          },
        });

        const pages = response.data.data || [];
        allPages.push(...pages);

        // Check if there's a next page
        if (response.data.paging && response.data.paging.next) {
          url = response.data.paging.next;
        } else {
          hasNextPage = false;
        }
      }

      console.log(`Fetched ${allPages.length} Facebook pages for user`);
      console.log('Pages data:', allPages.map(p => ({ id: p.id, name: p.name, hasAccessToken: !!p.access_token })));

      // Transform the response to include the profile picture URL
      const transformedPages = allPages.map((page: any) => ({
        ...page,
        profile_picture: page.picture?.data?.url,
        has_access_token: !!page.access_token,
      }));

      // For debugging, return all pages but mark which ones have access tokens
      // In production, we might want to filter to only show pages with access tokens
      return transformedPages;
    } catch (error: any) {
      console.error('Facebook API error:', error.response?.data || error.message);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Failed to fetch Facebook pages: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }

  /**
   * Post to Facebook page
   */
  async postToPage(
    pageId: string,
    pageAccessToken: string,
    content: {
      message: string;
      link?: string;
      image?: string;
    }
  ): Promise<FacebookPostResponse> {
    try {
      const postData: any = {
        message: content.message,
      };

      if (content.link) {
        postData.link = content.link;
      }

      // Note: For images, you'd need to upload the image first and get the media ID
      // This is a simplified version - full implementation would handle image uploads

      const response = await axios.post(
        `${this.baseURL}/${pageId}/feed`,
        postData,
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Failed to post to Facebook: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }

  /**
   * Check if access token is still valid
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/me`, {
        params: {
          access_token: accessToken,
          fields: "id",
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Refresh Facebook tokens for a social media account
   */
  async refreshTokens(socialMediaId: string): Promise<SocialMedia> {
    const socialMedia = await prisma.socialMedia.findUnique({
      where: { id: socialMediaId },
    });

    if (!socialMedia || !socialMedia.refreshToken) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Social media account not found or no refresh token available"
      );
    }

    try {
      // Try to get a new long-lived token using the refresh token (user access token)
      const newLongLivedToken = await this.getLongLivedToken(
        socialMedia.refreshToken
      );

      // Get fresh page access tokens
      const pages = await this.getUserPages(newLongLivedToken);
      const pageData = pages.find((page) => page.id === socialMedia.pageId);

      if (!pageData) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Facebook page not found in user accounts"
        );
      }

      // Update the social media record
      const updatedSocialMedia = await prisma.socialMedia.update({
        where: { id: socialMediaId },
        data: {
          accessToken: pageData.access_token,
          refreshToken: newLongLivedToken, // Store the long-lived user token for future refreshes
          tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          lastCheckedAt: new Date(),
        },
      });

      return updatedSocialMedia;
    } catch (error) {
      // If refresh fails, mark as inactive
      await prisma.socialMedia.update({
        where: { id: socialMediaId },
        data: {
          status: "inactive",
          lastCheckedAt: new Date(),
        },
      });
      throw error;
    }
  }

  /**
   * Ensure the app has permissions for a specific page
   */
  async ensurePagePermissions(userAccessToken: string, pageId: string): Promise<boolean> {
    try {
      // Method 1: Try to subscribe the app to the page
      const subscribeResponse = await axios.post(
        `${this.baseURL}/${pageId}/subscribed_apps`,
        null,
        {
          params: {
            access_token: userAccessToken,
            subscribed_fields: 'feed,posts'
          }
        }
      );

      console.log('✅ App subscribed to page:', subscribeResponse.data);
      return true;

    } catch (error: any) {
      console.log('❌ Cannot subscribe app to page - manual action required');

      // Method 2: Generate manual auth URL
      const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI || '')}` +
        `&scope=pages_manage_posts,pages_read_engagement` +
        `&response_type=code` +
        `&state=page_auth_${pageId}`;

      console.log('🔗 Manual auth required. Open this URL:');
      console.log(authUrl);

      return false;
    }
  }

  /**
   * Save Facebook pages as social media accounts
   */
  async saveFacebookPages(
    userId: string,
    teamId: string,
    pages: FacebookPage[]
  ): Promise<SocialMedia[]> {
    const savedAccounts: SocialMedia[] = [];

    for (const page of pages) {
      // Check if this page is already saved for this team
      const existingAccount = await prisma.socialMedia.findFirst({
        where: {
          teamId,
          platform: "facebook",
          pageId: page.id,
        },
      });

      if (existingAccount) {
        // Update existing account with new tokens
        const updatedAccount = await prisma.socialMedia.update({
          where: { id: existingAccount.id },
          data: {
            accountName: page.name,
            accessToken: page.access_token,
            refreshToken: null, // We'll store the user token separately
            tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            status: "active",
            lastCheckedAt: new Date(),
            image: page.profile_picture || existingAccount.image,
            profileLink: page.link || existingAccount.profileLink,
          },
        });
        savedAccounts.push(updatedAccount);
      } else {
        // Create new account
        const newAccount = await prisma.socialMedia.create({
          data: {
            accountName: page.name,
            teamId,
            platform: "facebook",
            profileLink: page.link || `https://facebook.com/${page.id}`,
            image: page.profile_picture,
            pageId: page.id,
            accessToken: page.access_token,
            refreshToken: null, // We'll handle user token storage separately
            tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            status: "active",
            lastCheckedAt: new Date(),
          },
        });
        savedAccounts.push(newAccount);
      }
    }

    return savedAccounts;
  }
}

export default new FacebookService();
