
'use server';

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { CreateWebsiteInputSchema, CreateWebsiteOutputSchema } from '@/ai/schemas';
import type { CreateWebsiteOutput } from '@/ai/schemas';

const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

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
  model: 'gemini-pro',
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


// AI Chat flow
const ChatInputSchema = z.object({
  text: z.string(),
  image: z.string().optional().describe('An optional image for context, passed as a data URI.'),
});
type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The AI assistant\'s conversational reply.'),
});
type ChatOutput = z.infer<typeof ChatOutputSchema>;


const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    model: 'gemini-pro-vision',
    prompt: `
        You are Byte AI, a friendly and helpful AI assistant.
        Your goal is to provide helpful, conversational, and accurate responses to user queries.
        If the user provides an image, analyze it and incorporate your observations into the response.

        User query: {{{text}}}
        {{#if image}}
        Image: {{media url=image}}
        {{/if}}
    `,
});

const diagnoseWebsiteChange = ai.defineFlow(
    {
        name: 'diagnoseWebsiteChange',
        inputSchema: ChatInputSchema,
        outputSchema: ChatOutputSchema,
    },
    async (input) => {
        const { output } = await chatPrompt(input);
        if (!output) {
            throw new Error('AI failed to generate a response.');
        }
        return output;
    }
);

export async function handleChat(text: string, image?: string): Promise<{ success: boolean; data?: ChatOutput; error?: string; }> {
    try {
        const output = await diagnoseWebsiteChange({ text, image });
        return {
            success: true,
            data: output,
        };
    } catch (error: any) {
        console.error('Error during chat interaction:', error);
        return {
            success: false,
            error: error.message || 'Failed to get a response. Please try again.',
        };
    }
}
