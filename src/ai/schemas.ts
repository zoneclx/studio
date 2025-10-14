
import { z } from 'genkit';

export const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

export const WebsiteCodeSchema = z.object({
    html: z.string().describe("The complete HTML code for the website, including the DOCTYPE declaration."),
    // CSS and JS are now expected to be inline in the HTML.
    // These fields are kept for schema compatibility but can be empty.
    css: z.string().describe("The CSS code for styling the website. This can be empty if using only Tailwind."),
    javascript: z.string().describe("The JavaScript code for any interactivity. This can be empty.")
});
export type WebsiteCode = z.infer<typeof WebsiteCodeSchema>;
