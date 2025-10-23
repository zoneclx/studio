
'use server';
/**
 * @fileOverview An AI flow to diagnose and suggest website changes.
 *
 * - diagnoseWebsiteChange - A function that handles responding to user requests for changes.
 * - DiagnoseWebsiteChangeInput - The input type for the function.
 * - DiagnoseWebsiteChangeOutput - The return type for the function.
 */

import { ai } from '@/app/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const DiagnoseWebsiteChangeInputSchema = z.object({
  text: z.string().describe('The user\'s request or question about the website code.'),
  image: z.string().optional().describe("An optional image provided by the user as a data URI for visual context. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DiagnoseWebsiteChangeInput = z.infer<typeof DiagnoseWebsiteChangeInputSchema>;

const DiagnoseWebsiteChangeOutputSchema = z.object({
  text: z.string().describe('The AI\'s response, providing an explanation or suggested code change.'),
});
export type DiagnoseWebsiteChangeOutput = z.infer<typeof DiagnoseWebsiteChangeOutputSchema>;


export async function diagnoseWebsiteChange(input: DiagnoseWebsiteChangeInput): Promise<DiagnoseWebsiteChangeOutput> {
  return await diagnoseWebsiteChangeFlow(input);
}

const diagnosisPrompt = ai.definePrompt({
  name: 'diagnoseWebsiteChangePrompt',
  model: googleAI.model('gemini-pro-vision'),
  input: { schema: DiagnoseWebsiteChangeInputSchema },
  output: { schema: DiagnoseWebsiteChangeOutputSchema },
  prompt: `
    You are an expert web developer acting as an AI assistant in a web-based code editor.
    A user is asking for help making a change to their website.
    Your role is to understand their request, analyze the provided context (text and optional image), and provide a helpful, concise response.

    - If the user asks a question, answer it clearly.
    - If the user asks to make a change, explain how they could do it. For example, if they say "make the background blue", you should respond with something like: "To change the background color, you can modify the 'background-color' property in your style.css file."
    - Be friendly and encouraging.
    - Keep your responses brief and to the point.

    User Request: "{{{text}}}"
    {{#if image}}
    The user also provided an image for context.
    Image: {{media url=image}}
    {{/if}}
  `,
});


const diagnoseWebsiteChangeFlow = ai.defineFlow(
  {
    name: 'diagnoseWebsiteChangeFlow',
    inputSchema: DiagnoseWebsiteChangeInputSchema,
    outputSchema: DiagnoseWebsiteChangeOutputSchema,
  },
  async (input) => {
    const { output } = await diagnosisPrompt(input);
    return output!;
  }
);
