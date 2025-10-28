import { z } from "zod";

const createSocialMedia = z.object({
  body: z.object({
    accountName: z.string().min(1, "Account name is required"),
    teamId: z.string().uuid("Invalid team ID"),
    platform: z.enum(["facebook", "twitter", "tiktok", "linkedin"]),
    profileLink: z.string().url("Invalid profile link"),
    image: z.string().optional(),
    status: z.string().optional().default("active"),
  }),
});

const getSocialMedia = z.object({
  params: z.object({
    id: z.string().uuid("Invalid social media ID"),
  }),
});

const getSocialMedias = z.object({
  query: z.object({
    teamId: z.string().uuid("Invalid team ID").optional(),
    platform: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortType: z.enum(["asc", "desc"]).optional(),
  }),
});

const updateSocialMedia = z.object({
  params: z.object({
    id: z.string().uuid("Invalid social media ID"),
  }),
  body: z.object({
    accountName: z.string().min(1).optional(),
    platform: z.string().optional(),
    profileLink: z.string().url().optional(),
    image: z.string().optional(),
    status: z.string().optional(),
  }),
});

const deleteSocialMedia = z.object({
  params: z.object({
    id: z.string().uuid("Invalid social media ID"),
  }),
});

// Facebook-specific validations
const saveFacebookPages = z.object({
  body: z.object({
    teamId: z.string().uuid("Invalid team ID"),
    pages: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          access_token: z.string(),
          category: z.string().optional(),
          tasks: z.array(z.string()).optional(),
          profile_picture: z.string().url().optional(),
          link: z.string().url().optional(),
        })
      )
      .min(1, "At least one page must be selected"),
  }),
});

const postToFacebookPage = z.object({
  body: z.object({
    socialMediaId: z.string().uuid("Invalid social media ID"),
    content: z.object({
      message: z.string().min(1, "Message is required"),
      link: z.string().url().optional(),
      image: z.string().url().optional(),
    }),
  }),
});

const refreshFacebookTokens = z.object({
  params: z.object({
    id: z.string().uuid("Invalid social media ID"),
  }),
});

export default {
  createSocialMedia,
  getSocialMedia,
  getSocialMedias,
  updateSocialMedia,
  deleteSocialMedia,
  // Facebook-specific validations
  saveFacebookPages,
  postToFacebookPage,
  refreshFacebookTokens,
};
