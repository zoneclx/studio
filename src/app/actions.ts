
'use server';

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// AI Chat flow
const ChatInputSchema = z.object({
  text: z.string().describe('The user\'s text query.'),
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
        You are Mono Ai, a friendly and helpful AI assistant.
        Your goal is to provide helpful, conversational, and accurate responses to user queries.
        If the user provides an image, analyze it and incorporate your observations into the response.

        User query: {{{text}}}
        {{#if image}}
        Image: {{media url=image}}
        {{/if}}
    `,
});

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
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
        const output = await chatFlow({ text, image });
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
