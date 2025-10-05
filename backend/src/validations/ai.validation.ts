import { z } from "zod";

const generateContentPlan = z.object({
  body: z.object({
    topicPreferences: z.array(z.string()).min(1, "At least one topic preference is required"),
    postFrequency: z.string().min(1, "Post frequency is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    tone: z.string().min(1, "Tone is required"),
  }),
});

export default {
  generateContentPlan,
};