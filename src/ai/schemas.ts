
import { z } from 'genkit';

export const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

export const WebsiteCodeSchema = z.object({
    html: z.string().describe("The complete HTML code for the website, including the DOCTYPE declaration."),
});
export type WebsiteCode = z.infer<typeof WebsiteCodeSchema>;


// New schema for the simplified builder
export const WebsiteGenInputSchema = z.object({
  prompt: z.string(),
});
export type WebsiteGenInput = z.infer<typeof WebsiteGenInputSchema>;

export const WebsiteGenOutputSchema = z.object({
  html: z.string(),
});
export type WebsiteGenOutput = z.infer<typeof WebsiteGenOutputSchema>;
