
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WebsiteCodeSchema = z.object({
  html: z.string().describe('The HTML body content for the website. Do not include <html>, <head>, or <body> tags. Use semantic HTML5 tags and modern design principles.'),
  css: z.string().describe('The corresponding CSS for the website. It should be clean, modern, and responsive. Use flexbox or grid for layout.'),
  javascript: z.string().describe('The JavaScript for any interactive elements. If no interactivity is needed, return an empty string.'),
});

export const CreateWebsiteInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the website to create.'),
});
export type CreateWebsiteInput = z.infer<typeof CreateWebsiteInputSchema>;

export const CreateWebsiteOutputSchema = WebsiteCodeSchema;
export type CreateWebsiteOutput = z.infer<typeof CreateWebsiteOutputSchema>;


export async function handleGeneration(prompt: string): Promise<{ success: boolean; data?: CreateWebsiteOutput; error?: string; }> {
    try {
        const output = await createWebsiteFlow({ prompt });
        return {
            success: true,
            data: output,
        };
    } catch (error: any) {
        console.error('Error during website generation:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate website. Please try again.',
        };
    }
}


const websiteGenerationPrompt = ai.definePrompt({
  name: 'websiteGenerationPrompt',
  input: { schema: CreateWebsiteInputSchema },
  output: { schema: CreateWebsiteOutputSchema },
  prompt: `
    You are a professional web developer. A user will provide a prompt describing a website they want to create.
    Your task is to generate the HTML, CSS, and JavaScript for a complete, visually appealing, and functional single-page website based on the user's prompt.

    **Instructions:**
    1.  **HTML:** Create the body of the HTML. Do not include <html>, <head>, or <body> tags. Use semantic HTML5 tags.
    2.  **CSS:** Generate the corresponding CSS. It should be modern, clean, and make the website look good. Use flexbox or grid for layout. Ensure it is responsive.
    3.  **JavaScript:** If the prompt implies any interactivity (e.g., "a button that shows a message", "an image carousel"), write the necessary JavaScript. If no interactivity is needed, return an empty string.

    **User Prompt:**
    {{{prompt}}}
  `,
});


const createWebsiteFlow = ai.defineFlow(
  {
    name: 'createWebsiteFlow',
    inputSchema: CreateWebsiteInputSchema,
    outputSchema: CreateWebsiteOutputSchema,
  },
  async (input) => {
    const { output } = await websiteGenerationPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate website content.');
    }
    return output;
  }
);
