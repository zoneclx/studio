
'use server';
/**
 * @fileOverview A flow that generates a website based on a prompt.
 *
 * - generateWebsite - A function that handles the website generation process.
 * - GenerateWebsiteOutput - The return type for the generateWebsite function.
 */

import { ai } from '@/app/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const WebFileSchema = z.object({
    name: z.string().describe('The name of the file, e.g., index.html, style.css'),
    language: z.string().describe('The language of the file, e.g., html, css, javascript'),
    content: z.string().describe('The full content of the file.'),
});

const GenerateWebsiteOutputSchema = z.object({
  files: z.array(WebFileSchema).describe('An array of files that make up the website.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsite(prompt: string): Promise<GenerateWebsiteOutput> {
  return await generateWebsiteFlow(prompt);
}

const generationPrompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  model: googleAI.model('gemini-pro'),
  input: { schema: z.string() },
  output: { schema: GenerateWebsiteOutputSchema },
  prompt: `
    You are an expert web developer. A user will provide a prompt to describe a website they want to create.
    Your task is to generate the complete HTML, CSS, and JavaScript files for a simple, modern, and aesthetically pleasing website based on that prompt.

    Guidelines:
    1.  Always generate at least three files: \`index.html\`, \`style.css\`, and \`script.js\`.
    2.  The \`index.html\` should correctly link to the \`style.css\` and \`script.js\` files.
    3.  Use placeholder images from picsum.photos if the user asks for images. Example: https://picsum.photos/seed/1/800/600.
    4.  Ensure the generated code is clean, well-formatted, and follows best practices.
    5.  The design should be responsive and look good on modern browsers.
    6.  For styling, use CSS. Do not use Tailwind or any other CSS framework, just plain CSS in the style.css file.
    7.  The javascript file should contain some minimal interactivity if it makes sense for the prompt.

    User Prompt:
    {{{prompt}}}
  `,
});

const generateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateWebsiteFlow',
    inputSchema: z.string(),
    outputSchema: GenerateWebsiteOutputSchema,
  },
  async (prompt) => {
    const { output } = await generationPrompt(prompt);
    return output!;
  }
);
