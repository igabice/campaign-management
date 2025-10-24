import { z } from "zod";

export const PayoutSchema = z.object({
  country: z.string().min(2, "Country is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
});

export const CampaignFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  landingPageUrl: z
    .string()
    .url("Landing Page URL must be a valid URL.")
    .min(1, "Landing Page URL is required."),
  isRunning: z.boolean().default(false),
  payouts: z.array(PayoutSchema).nullable().optional(),
});

export type CampaignFormData = z.infer<typeof CampaignFormSchema>;

export interface Post {
  id: string;
  title?: string;
  content: string;
  socialMedias: { id: string; accountName: string; platform: string }[];
  image?: string;
  scheduledDate: string;
  sendReminder?: boolean;
  plannerId?: string;
  planId?: string;
  createdBy: string;
  status: "Draft" | "Posted";
  createdAt: string;
  updatedAt: string;
  approvalStatus?: string;
  creator: { id: string; name: string; email: string };
  team: { id: string; title: string };
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  tone?: string;
  createdBy: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  posts: Post[];
  creator: { id: string; name: string; email: string };
  team: { id: string; title: string };
  // Approval fields
  approverId?: string;
  approvalStatus?: string;
  approvalNotes?: string;
  approvedAt?: string;
  approver?: { id: string; name: string; email: string };
}

export interface TopicPreference {
  id: string;
  topic: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;

  // Notification Preferences
  emailNotifications: boolean;
  telegramEnabled: boolean;
  telegramChatId?: string;
  whatsappEnabled: boolean;
  whatsappNumber?: string;

  // Content Planning Preferences
  postsPerDay?: number;
  postsPerWeek?: number;
  preferredPostTimes: string[];
  preferredPostDays: string[];

  // Content Topics
  topics: TopicPreference[];

  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  image?: string;
  published: boolean;
  publishedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string; email: string };
}
