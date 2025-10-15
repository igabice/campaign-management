import { z } from 'zod';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export const createUserPreferenceSchema = z.object({
  body: z.object({
    // Notification Preferences
    emailNotifications: z.boolean().optional(),
    telegramEnabled: z.boolean().optional(),
    telegramChatId: z.string().optional(),
    whatsappEnabled: z.boolean().optional(),
    whatsappNumber: z.string().optional(),

    // Content Planning Preferences
    postsPerDay: z.number().int().min(1).max(20).optional(),
    postsPerWeek: z.number().int().min(1).max(100).optional(),
    preferredPostTimes: z.array(z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
    preferredPostDays: z.array(z.enum(daysOfWeek)).optional(),

    // Content Topics
    topics: z.array(z.object({
      topic: z.string().min(1).max(100),
      weight: z.number().int().min(1).max(5).optional().default(1)
    })).optional(),
  }),
});

export const updateUserPreferenceSchema = z.object({
  body: z.object({
    // Notification Preferences
    emailNotifications: z.boolean().optional(),
    telegramEnabled: z.boolean().optional(),
    telegramChatId: z.string().optional(),
    whatsappEnabled: z.boolean().optional(),
    whatsappNumber: z.string().optional(),

    // Content Planning Preferences
    postsPerDay: z.number().int().min(1).max(20).optional(),
    postsPerWeek: z.number().int().min(1).max(100).optional(),
    preferredPostTimes: z.array(z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
    preferredPostDays: z.array(z.enum(daysOfWeek)).optional(),

    // Content Topics
    topics: z.array(z.object({
      topic: z.string().min(1).max(100),
      weight: z.number().int().min(1).max(5).optional().default(1)
    })).optional(),
  }),
});

export const updateTopicsSchema = z.object({
  body: z.object({
    topics: z.array(z.object({
      topic: z.string().min(1).max(100),
      weight: z.number().int().min(1).max(5).optional().default(1)
    })),
  }),
});

export type CreateUserPreferenceInput = z.infer<typeof createUserPreferenceSchema>['body'];
export type UpdateUserPreferenceInput = z.infer<typeof updateUserPreferenceSchema>['body'];
export type UpdateTopicsInput = z.infer<typeof updateTopicsSchema>['body'];