'use server';

/**
 * @fileOverview An AI agent that categorizes a user's chat request.
 *
 * - categorizeChatRequest - A function that analyzes user input to determine if it's a request to build a website or a general question.
 * - CategorizeChatRequestInput - The input type for the categorizeChatRequest function.
 * - CategorizeChatRequestOutput - The return type for the categorizeChatRequest function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeChatRequestInputSchema = z.object({
  text: z.string().describe("The user's chat message."),
});
export type CategorizeChatRequestInput = z.infer<
  typeof CategorizeChatRequestInputSchema
>;

const CategorizeChatRequestOutputSchema = z.object({
  category: z
    .enum(['code_request', 'general_inquiry'])
    .describe(
      'Categorize the user request. Use "code_request" if the user is asking to build or generate a website. Otherwise, use "general_inquiry".'
    ),
  response: z.string().optional().describe('A helpful response to a "general_inquiry". This should be empty for a "code_request".'),
  prompt: z
    .string()
    .optional()
    .describe('If the category is "code_request", this should be the extracted prompt for the website. This should be empty for a "general_inquiry".'),
});
export type CategorizeChatRequestOutput = z.infer<
  typeof CategorizeChatRequestOutputSchema
>;

export async function categorizeChatRequest(
  input: CategorizeChatRequestInput
): Promise<CategorizeChatRequestOutput> {
  return categorizeChatRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeChatRequestPrompt',
  input: { schema: CategorizeChatRequestInputSchema },
  output: { schema: CategorizeChatRequestOutputSchema },
  prompt: `You are a helpful AI assistant for a website builder. Your job is to analyze the user's message and determine their intent.

1.  **If the user is asking to create, build, or generate a website, a page, or any kind of HTML code:**
    *   Set the \`category\` to \`"code_request"\`.
    *   Extract the core description of what they want to build and put it in the \`prompt\` field.
    *   Leave the \`response\` field empty.
    *   Examples: "Create a portfolio for a painter", "Make a landing page for my new app", "Generate a website for my dog walking business".

2.  **If the user is asking a question, asking for ideas, or having a general conversation:**
    *   Set the \`category\` to \`"general_inquiry"\`.
    *   Provide a friendly and helpful answer in the \`response\` field.
    *   Leave the \`prompt\` field empty.
    *   Examples: "What kind of websites can you build?", "Give me some ideas for a restaurant website", "Hello!".

**User Message:**
"{{{text}}}"
`,
});

const categorizeChatRequestFlow = ai.defineFlow(
  {
    name: 'categorizeChatRequestFlow',
    inputSchema: CategorizeChatRequestInputSchema,
    outputSchema: CategorizeChatRequestOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
