'use server';

/**
 * @fileOverview Improves the quality of the input text using an AI model.
 *
 * - improveTextQuality - A function that accepts a text input and returns an improved version of the text.
 * - ImproveTextQualityInput - The input type for the improveTextQuality function.
 * - ImproveTextQualityOutput - The return type for the improveTextQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTextQualityInputSchema = z.object({
  text: z
    .string()
    .describe('The text to improve.'),
});

export type ImproveTextQualityInput = z.infer<typeof ImproveTextQualityInputSchema>;

const ImproveTextQualityOutputSchema = z.object({
  improvedText: z.string().describe('The improved text.'),
});

export type ImproveTextQualityOutput = z.infer<typeof ImproveTextQualityOutputSchema>;

export async function improveTextQuality(input: ImproveTextQualityInput): Promise<ImproveTextQualityOutput> {
  return improveTextQualityFlow(input);
}

const improveTextQualityPrompt = ai.definePrompt({
  name: 'improveTextQualityPrompt',
  input: {schema: ImproveTextQualityInputSchema},
  output: {schema: ImproveTextQualityOutputSchema},
  prompt: `Improve the quality of the following text. Focus on clarity, grammar, and overall readability.\n\nText: {{{text}}}`,
});

const improveTextQualityFlow = ai.defineFlow(
  {
    name: 'improveTextQualityFlow',
    inputSchema: ImproveTextQualityInputSchema,
    outputSchema: ImproveTextQualityOutputSchema,
  },
  async input => {
    const {output} = await improveTextQualityPrompt(input);
    return output!;
  }
);
