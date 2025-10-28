import nodemailer from "nodemailer";
import { Invite } from "@prisma/client";
import logger from "../config/logger";
import config from "../config/config";

interface TeamWithUser {
  id: string;
  title: string;
  user: {
    name: string | null;
    email: string;
  };
}

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInviteEmail(invite: Invite, team: TeamWithUser): Promise<void> {
    const inviteUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/invites/${invite.id}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited to join ${team.title}</h2>
        <p>Hello,</p>
        <p>You have been invited to join the team "${team.title}" by ${team.user.name || team.user.email}.</p>
        <p>Click the button below to respond to your invitation:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Invitation
          </a>
        </div>
        <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: invite.email,
        subject: `Invitation to join ${team.title}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send invite email:", error);
      // Don't throw error - invite is still created even if email fails
    }
  }

  async sendWelcomeEmail(user: {
    name: string | null;
    email: string;
  }): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Dokahub!</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Welcome to the Dokahub platform! Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Create and manage teams</li>
          <li>Invite team members</li>
          <li>Track campaign performance</li>
          <li>Schedule social media posts</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy campaigning!<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: "Welcome to Dokahub!",
        html,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't throw error - account is still created even if email fails
    }
  }

  async sendWelcomeTeamEmail(team: {
    title: string;
    user: { name: string | null; email: string };
  }): Promise<void> {
    const teamUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Team "${team.title}" Created Successfully! 🚀</h2>
        <p>Hello ${team.user.name || "there"},</p>
        <p>Congratulations! Your team "${team.title}" has been created successfully.</p>
        <p>You are now the owner of this team and can:</p>
        <ul>
          <li>Invite team members</li>
          <li>Manage social media accounts</li>
          <li>Schedule campaigns</li>
          <li>Track team performance</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${teamUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Manage Your Team
          </a>
        </div>
        <p>Start by inviting your team members to collaborate on campaigns!</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: team.user.email,
        subject: `Team "${team.title}" Created Successfully!`,
        html,
      });
    } catch (error) {
      console.error("Failed to send welcome team email:", error);
      // Don't throw error - team is still created even if email fails
    }
  }

  async sendReEngagementEmail(
    user: { name: string | null; email: string },
    daysInactive: number
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

    const reEngagementContent = {
      3: {
        subject: "We miss you! Come back to Dokahub",
        message:
          "It's been a few days since we last saw you. Your campaigns might need some attention!",
        cta: "Check Your Campaigns",
      },
      5: {
        subject: "Your campaigns are waiting for you",
        message:
          "Your scheduled posts and campaign performance are ready for review.",
        cta: "View Dashboard",
      },
      7: {
        subject: "Don't forget about your social media strategy",
        message:
          "Keep your audience engaged with fresh content and strategic posting.",
        cta: "Plan Your Content",
      },
      14: {
        subject: "Time to boost your social media presence",
        message:
          "Consistent posting leads to better engagement. Let's get back on track!",
        cta: "Schedule Posts",
      },
      21: {
        subject: "Your audience is waiting - let's create some content!",
        message:
          "It's been a few weeks! Your followers miss your valuable content.",
        cta: "Create Content",
      },
    };

    const content =
      reEngagementContent[daysInactive as keyof typeof reEngagementContent];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${content.subject} 👋</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>${content.message}</p>
        <p>Here are some things you can do right now:</p>
        <ul>
          <li>Review your campaign performance</li>
          <li>Schedule new posts for your audience</li>
          <li>Check in with your team members</li>
          <li>Plan your next content strategy</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            ${content.cta}
          </a>
        </div>
        <p>We value you as part of our community and want to help you succeed!</p>
        <p>Best regards,<br>The Dokahub Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you haven't been active on Dokahub for ${daysInactive} days.
          If you no longer wish to receive these emails, you can update your preferences in your account settings.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: content.subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send re-engagement email:", error);
      throw error; // Re-throw for task error handling
    }
  }

  async sendOnboardingEmail(
    user: { name: string | null; email: string },
    campaign: {
      subject: string;
      feature: string;
      content: string;
      daysAfterRegistration: number;
    }
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

    const featureUrls = {
      "Team Management": `${process.env.FRONTEND_URL || "http://localhost:3000"}/team`,
      "Social Media Integration": `${process.env.FRONTEND_URL || "http://localhost:3000"}/team`, // Social media accounts are managed in team settings
      "AI Content Generation": `${process.env.FRONTEND_URL || "http://localhost:3000"}/content-planner`,
      "Post Scheduling": `${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar`,
      "Performance Analytics": `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`, // Analytics would be in dashboard
    };

    const featureUrl =
      featureUrls[campaign.feature as keyof typeof featureUrls] || dashboardUrl;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${campaign.subject} 🚀</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Welcome back! It's been ${campaign.daysAfterRegistration} days since you joined Dokahub.</p>
        <p>Today, let's explore: <strong>${campaign.feature}</strong></p>
        <p>${campaign.content}</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">💡 Pro Tip</h3>
          <p style="margin-bottom: 0;">${getProTip(campaign.feature)}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${featureUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Explore ${campaign.feature}
          </a>
        </div>

        <p>Remember, consistent use of Dokahub will help you:</p>
        <ul>
          <li>Grow your social media presence</li>
          <li>Engage better with your audience</li>
          <li>Collaborate effectively with your team</li>
          <li>Track and improve your performance</li>
        </ul>

        <p>We're here to help you succeed! Feel free to reach out if you have any questions.</p>
        <p>Happy campaigning!<br>The Dokahub Team</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is email ${campaign.daysAfterRegistration === 3 ? "1" : campaign.daysAfterRegistration === 5 ? "2" : campaign.daysAfterRegistration === 7 ? "3" : campaign.daysAfterRegistration === 14 ? "4" : "5"} of 5 in our onboarding series.
          You're receiving this because you signed up for Dokahub ${campaign.daysAfterRegistration} days ago.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: campaign.subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send onboarding email:", error);
      throw error; // Re-throw for task error handling
    }
  }

  async sendSubscriptionWelcomeEmail(user: {
    name: string | null;
    email: string;
    plan: string;
  }): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

    const planNames = {
      free: "Free",
      pro: "Pro",
      enterprise: "Enterprise",
    };

    const planName = planNames[user.plan as keyof typeof planNames] || "Pro";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${planName} Plan! 🎉</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Thank you for upgrading to the <strong>${planName} Plan</strong>! Your subscription has been successfully activated.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #28a745;">🚀 What you can do now:</h3>
          <ul style="margin-bottom: 0;">
            ${
              user.plan === "professional"
                ? `
              <li>Create up to 5 teams</li>
              <li>Schedule up to 100 posts per month</li>
              <li>Generate AI-powered content</li>
              <li>Access advanced analytics</li>
              <li>Collaborate with team members</li>
            `
                : user.plan === "agency"
                  ? `
              <li>Unlimited teams and posts</li>
              <li>All Pro features</li>
              <li>Custom integrations</li>
              <li>Dedicated support</li>
              <li>Advanced enterprise features</li>
            `
                  : `
              <li>Create up to 1 team</li>
              <li>Schedule up to 10 posts per month</li>
              <li>Basic analytics</li>
            `
            }
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Start Using Your New Features
          </a>
        </div>

        <p>If you have any questions about your subscription or need help getting started, don't hesitate to reach out to our support team.</p>
        <p>Welcome to the next level of campaign management!</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: `Welcome to ${planName} Plan - Subscription Activated!`,
        html,
      });
    } catch (error) {
      console.error("Failed to send subscription welcome email:", error);
      // Don't throw error - subscription is still created even if email fails
    }
  }

  async sendSubscriptionActivatedEmail(user: {
    name: string | null;
    email: string;
    plan: string;
  }): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

    const planNames = {
      free: "Free",
      pro: "Pro",
      enterprise: "Enterprise",
    };

    const planName = planNames[user.plan as keyof typeof planNames] || "Pro";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Activated! ✅</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Great news! Your ${planName} Plan subscription has been successfully activated and is now ready to use.</p>

        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #155724;"><strong>✓ Subscription Status:</strong> Active</p>
          <p style="margin: 5px 0 0 0; color: #155724;"><strong>✓ Plan:</strong> ${planName}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>

        <p>You now have access to all the features included in your plan. Start creating amazing campaigns!</p>
        <p>If you need any assistance, our support team is here to help.</p>
        <p>Happy campaigning!<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: `Subscription Activated - ${planName} Plan`,
        html,
      });
    } catch (error) {
      console.error("Failed to send subscription activated email:", error);
      // Don't throw error - subscription is still activated even if email fails
    }
  }

  async sendSubscriptionCancelledEmail(user: {
    name: string | null;
    email: string;
    plan: string;
  }): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;
    const billingUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/subscription`;

    const planNames = {
      free: "Free",
      pro: "Pro",
      enterprise: "Enterprise",
    };

    const planName = planNames[user.plan as keyof typeof planNames] || "Pro";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Cancelled</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>We're sorry to see you go. Your ${planName} Plan subscription has been cancelled as requested.</p>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Important:</strong> You will continue to have access to your ${planName} Plan features until the end of your current billing period.</p>
        </div>

        <p>During this time, you can:</p>
        <ul>
          <li>Continue using all plan features</li>
          <li>Export your data and campaigns</li>
          <li>Reactivate your subscription anytime</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${billingUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 10px;">
            Reactivate Subscription
          </a>
          <a href="${dashboardUrl}" style="background-color: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Access Dashboard
          </a>
        </div>

        <p>We truly appreciate the time you've spent with us and hope to see you back soon. If there's anything we could have done better, we'd love to hear your feedback.</p>
        <p>Thank you for being part of our community!</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: `Subscription Cancelled - ${planName} Plan`,
        html,
      });
    } catch (error) {
      console.error("Failed to send subscription cancelled email:", error);
      // Don't throw error - subscription is still cancelled even if email fails
    }
  }

  async sendResetPasswordEmail(
    user: { name: string | null; email: string },
    resetUrl: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password 🔒</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>You have requested to reset your password for your Dokahub account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
          ${resetUrl}
        </p>
        <p>For security reasons, please don't share this email or the reset link with anyone.</p>
        <p>Best regards,<br>The Dokahub Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          If you have any issues resetting your password, please contact our support team.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: "Reset Your Password - Dokahub",
        html,
      });
    } catch (error) {
      console.error("Failed to send reset password email:", error);
      throw error; // Re-throw for auth error handling
    }
  }

  async sendPasswordChangeConfirmationEmail(
    user: { name: string | null; email: string },
    changeTime: Date = new Date()
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;
    const formattedTime = changeTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Changed Successfully 🔐</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>Your password for your Dokahub account has been successfully changed.</p>

        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #155724;"><strong>✓ Password Change Confirmed</strong></p>
          <p style="margin: 5px 0 0 0; color: #155724;"><strong>Time:</strong> ${formattedTime}</p>
          <p style="margin: 5px 0 0 0; color: #155724;"><strong>Account:</strong> ${user.email}</p>
        </div>

        <p>If you made this change, no further action is required. Your account is now secure with your new password.</p>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">⚠️ Security Notice</h3>
          <p style="margin-bottom: 0; color: #856404;">
            If you did not request this password change, please contact our support team immediately and consider changing your password again.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>

        <p>For your security, we recommend:</p>
        <ul>
          <li>Using a strong, unique password</li>
          <li>Enabling two-factor authentication if available</li>
          <li>Regularly monitoring your account activity</li>
        </ul>

        <p>If you have any questions or concerns about your account security, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Dokahub Team</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
          If you need assistance, contact our support team at support@dokahub.com
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: "Password Changed Successfully - Dokahub",
        html,
      });
    } catch (error) {
      console.error(
        "Failed to send password change confirmation email:",
        error
      );
      // Don't throw error - password change is still successful even if email fails
    }
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: options.from || process.env.SMTP_FROM || "noreply@dokahub.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  async sendFacebookTokenExpiredEmail(user: {
    name: string | null;
    email: string;
    accountName: string;
  }): Promise<void> {
    const teamUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Facebook Connection Needs Refresh 🔄</h2>
        <p>Hello ${user.name || "there"},</p>
        <p>We noticed that your Facebook connection for "${user.accountName}" has expired and needs to be refreshed.</p>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">⚠️ Action Required</h3>
          <p style="margin-bottom: 0; color: #856404;">
            Your automated posting to this Facebook page has been paused until you reconnect your account.
          </p>
        </div>

        <p>To restore automated posting, please:</p>
        <ol>
          <li>Go to your team settings</li>
          <li>Find the Facebook account "${user.accountName}"</li>
          <li>Click "Reconnect" or "Refresh Connection"</li>
          <li>Follow the Facebook login prompts</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${teamUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Manage Facebook Connections
          </a>
        </div>

        <p><strong>What happens if I don't reconnect?</strong></p>
        <ul>
          <li>Automated posting to this Facebook page will remain paused</li>
          <li>Scheduled posts will be skipped</li>
          <li>You can still post manually through Facebook</li>
        </ul>

        <p>Facebook access tokens expire regularly for security reasons. We recommend reconnecting as soon as possible to maintain uninterrupted posting.</p>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <p>Best regards,<br>The Dokahub Team</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated notification about your Facebook integration.
          You're receiving this because you have connected Facebook pages for automated posting.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: user.email,
        subject: `Facebook Connection Expired - ${user.accountName}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send Facebook token expired email:", error);
      // Don't throw error - token refresh task should continue
    }
  }

  async verifyConnection(): Promise<void> {
    if (config.env !== "test") {
      this.transporter
        .verify()
        .then(() => logger.info("Connected to email server"))
        .catch(() => {
          logger.warn(
            "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
          );
        });
    }
  }

  // Approval notification methods
  async sendPostApprovalRequestEmail(
    post: {
      id: string;
      title?: string | null;
      content: string;
      creator: { name: string | null; email: string };
      team: { title: string };
    },
    approver: { name: string | null; email: string }
  ): Promise<void> {
    const approvalUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Post Approval Request </h2>
        <p>Hello ${approver.name || "there"},</p>
        <p>You have been assigned as the approver for a new post in the team "${post.team.title}".</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">Post Details:</h3>
          <p><strong>Title:</strong> ${post.title || "Untitled Post"}</p>
          <p><strong>Created by:</strong> ${post.creator.name || post.creator.email}</p>
          <p><strong>Content Preview:</strong> ${post.content.substring(0, 150)}${post.content.length > 150 ? "..." : ""}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${approvalUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Review Post
          </a>
        </div>

        <p>Please review the post and either approve or reject it. Your feedback will help maintain quality standards for the team.</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: approver.email,
        subject: `Post Approval Request - ${post.team.title}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send post approval request email:", error);
    }
  }

  async sendPlanApprovalRequestEmail(
    plan: {
      id: string;
      title: string;
      description?: string | null;
      creator: { name: string | null; email: string };
      team: { title: string };
    },
    approver: { name: string | null; email: string }
  ): Promise<void> {
    const approvalUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/content-planner`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Content Plan Approval Request </h2>
        <p>Hello ${approver.name || "there"},</p>
        <p>You have been assigned as the approver for a new content plan in the team "${plan.team.title}".</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">Plan Details:</h3>
          <p><strong>Title:</strong> ${plan.title}</p>
          <p><strong>Created by:</strong> ${plan.creator.name || plan.creator.email}</p>
          ${plan.description ? `<p><strong>Description:</strong> ${plan.description}</p>` : ""}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${approvalUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Review Plan
          </a>
        </div>

        <p>Please review the content plan and either approve or reject it. Your feedback will help ensure campaign quality and alignment with team goals.</p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: approver.email,
        subject: `Content Plan Approval Request - ${plan.team.title}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send plan approval request email:", error);
    }
  }

  async sendPostApprovalResultEmail(
    post: {
      id: string;
      title?: string | null;
      approvalStatus: string | null;
      approvalNotes?: string | null;
      approver?: { name: string | null } | null;
    },
    creator: { name: string | null; email: string }
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar`;
    const status = post.approvalStatus === "approved" ? "Approved" : "Rejected";
    const color = post.approvalStatus === "approved" ? "#28a745" : "#dc3545";
    const emoji = post.approvalStatus === "approved" ? "✅" : "❌";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Post ${status} ${emoji}</h2>
        <p>Hello ${creator.name || "there"},</p>
        <p>Your post "${post.title || "Untitled Post"}" has been <strong style="color: ${color};">${status.toLowerCase()}</strong> by ${post.approver?.name || "the approver"}.</p>

        ${
          post.approvalNotes
            ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">Approval Notes:</h3>
          <p style="margin-bottom: 0;">${post.approvalNotes}</p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Post
          </a>
        </div>

        <p>${
          post.approvalStatus === "approved"
            ? "Your post is now ready for scheduling. You can proceed with publishing it according to your campaign timeline."
            : "Please review the approval notes and make necessary changes before resubmitting for approval."
        }
        </p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: creator.email,
        subject: `Post ${status} - ${post.title || "Untitled Post"}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send post approval result email:", error);
    }
  }

  async sendPlanApprovalResultEmail(
    plan: {
      id: string;
      title: string;
      approvalStatus: string | null;
      approvalNotes?: string | null;
      approver?: { name: string | null } | null;
    },
    creator: { name: string | null; email: string }
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/content-planner`;
    const status = plan.approvalStatus === "approved" ? "Approved" : "Rejected";
    const color = plan.approvalStatus === "approved" ? "#28a745" : "#dc3545";
    const emoji = plan.approvalStatus === "approved" ? "✅" : "❌";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Content Plan ${status} ${emoji}</h2>
        <p>Hello ${creator.name || "there"},</p>
        <p>Your content plan "${plan.title}" has been <strong style="color: ${color};">${status.toLowerCase()}</strong> by ${plan.approver?.name || "the approver"}.</p>

        ${
          plan.approvalNotes
            ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">Approval Notes:</h3>
          <p style="margin-bottom: 0;">${plan.approvalNotes}</p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Plan
          </a>
        </div>

        <p>${
          plan.approvalStatus === "approved"
            ? "Your content plan is now approved and ready for implementation. You can proceed with publishing the posts according to your campaign timeline."
            : "Please review the approval notes and make necessary changes before resubmitting for approval."
        }
        </p>
        <p>Best regards,<br>The Dokahub Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@dokahub.com",
        to: creator.email,
        subject: `Content Plan ${status} - ${plan.title}`,
        html,
      });
    } catch (error) {
      console.error("Failed to send plan approval result email:", error);
    }
  }
}

function getProTip(feature: string): string {
  const tips = {
    "Team Management":
      "Start by inviting 2-3 key team members who will help manage your social media accounts.",
    "Social Media Integration":
      "Connect your primary brand accounts first, then add secondary accounts as needed.",
    "AI Content Generation":
      "Use specific keywords and tone preferences to get better AI-generated content.",
    "Post Scheduling":
      "Schedule posts during your audience's peak activity times for maximum engagement.",
    "Performance Analytics":
      "Review your top-performing posts weekly to understand what resonates with your audience.",
  };
  return (
    tips[feature as keyof typeof tips] ||
    "Consistency is key to social media success!"
  );
}

const mailService = new MailService();

export default mailService;
