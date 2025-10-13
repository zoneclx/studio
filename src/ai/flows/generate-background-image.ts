'use server';
/**
 * @fileOverview A background image generation AI agent.
 *
 * - generateBackgroundImage - A function that generates a background image.
 * - GenerateBackgroundImageOutput - The return type for the generateBackgroundImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBackgroundImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateBackgroundImageOutput = z.infer<
  typeof GenerateBackgroundImageOutputSchema
>;

export async function generateBackgroundImage(): Promise<GenerateBackgroundImageOutput> {
  return generateBackgroundImageFlow();
}

const generateBackgroundImageFlow = ai.defineFlow(
  {
    name: 'generateBackgroundImageFlow',
    outputSchema: GenerateBackgroundImageOutputSchema,
  },
  async () => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt:
        'A beautiful cinematic view of a distant galaxy with colorful planets and nebulae, deep space, stars, hyperrealistic.',
    });
    return { imageUrl: media.url };
  }
);
