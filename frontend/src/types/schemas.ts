import { z } from 'zod';

export const PayoutSchema = z.object({
  country: z.string().min(2, "Country is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
});

export const CampaignFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  landingPageUrl: z.string().url("Landing Page URL must be a valid URL.").min(1, "Landing Page URL is required."),
  isRunning: z.boolean().default(false),
  payouts: z.array(PayoutSchema).nullable().optional(),
});

export type CampaignFormData = z.infer<typeof CampaignFormSchema>;
