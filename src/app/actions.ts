
'use server';

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const WebsiteCodeSchema = z.object({
  html: z.string().describe('The HTML body content for the website.'),
  css: z.string().describe('The CSS styles for the website.'),
  javascript: z.string().describe('The JavaScript for any interactive elements.'),
});

const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('The user prompt describing the website to create.'),
});

const createWebsiteFlow = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const websiteGenerationPrompt = createWebsiteFlow.definePrompt({
  name: 'websiteGenerationPrompt',
  input: { schema: CreateWebsiteFromPromptInputSchema },
  output: { schema: WebsiteCodeSchema },
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

export async function handleGeneration(prompt: string) {
  try {
    const { output } = await websiteGenerationPrompt({ prompt });
    if (!output) {
      throw new Error('No output from AI');
    }
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
