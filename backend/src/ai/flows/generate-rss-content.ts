import { ai } from "../genkit";
import { z } from "genkit";

// Utility function to add timeout to promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
    ),
  ]);
}

const generateContentFromRSSInputSchema = z.object({
  agencyDescription: z.string().describe("The snippet of the news article."),
  title: z.string().describe("The title of the news article."),
  content: z.string().describe("The content of the news article."),
  contentSnippet: z
    .string()
    .describe("The contentSnippet of the news article."),
  source: z.string().describe("The source of the news article."),
});
export type GenerateContentPlanInput = z.infer<
  typeof generateContentFromRSSInputSchema
>;

const ArticleSchema = z.object({
  title: z.string().describe("Title of the content (for internal tracking)."),
  body: z.string().describe("The full content of the content."),
  hook: z.string().describe("The full content of the content."),
  callToAction: z.string().describe("The full content of the content."),
  onScreenText: z.string().describe("The full content of the content."),
});

export type GenerateContentPlanOutput = z.infer<typeof ArticleSchema>;

// the Nigerian startup and fintech scene

const generateContentFromRSS = ai.definePrompt({
  name: "generateContentFromRSS",
  input: { schema: generateContentFromRSSInputSchema },
  output: { schema: ArticleSchema },
  prompt: `You are a viral content creator for {{agencyDescription}}. 
    Write a 45-second video script based on this news: {{title}} available in this link: {{source}}".
    Context: {{contentSnippet}}
    Content: {{content}}
    
    TONE: Professional but uses Nigerian tech slang (e.g., "Bags secured," "Unicorn moves," "Oya check this").
    STRUCTURE: 
    1. Hook: Catchy first sentence.
    2. Body: Breakdown of the content e.g. funding or startup news.
    3. CTA: Engagement question about content e.g. the Nigerian economy.
    
    Output the result in valid JSON format only, with keys: title, hook, body, callToAction, onScreenText.
  `,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: "generateContentFlow",
    inputSchema: generateContentFromRSSInputSchema,
    outputSchema: z.object({
      title: z.any(),
      hook: z.any(),
      body: z.any(),
      callToAction: z.any(),
      onScreenText: z.any(),
    }),
  },
  async (input: GenerateContentPlanInput) => {
    const { output } = await withTimeout(generateContentFromRSS(input), 60000); // 60 second timeout
    if (!output || !output.body) {
      return {} as Article;
    }

    return output as Article;
  }
);

interface Article {
  title?: string;
  hook?: string;
  body?: string;
  callToAction?: string;
  onScreenText?: string;
}

export async function generateArticle(
  input: GenerateContentPlanInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Article> {
  return generateArticleFlow(input);
}
