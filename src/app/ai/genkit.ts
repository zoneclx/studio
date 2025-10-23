import { Ai } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit, GENKIT_ENV } from 'genkit';

let aiInstance: Ai;

if (GENKIT_ENV === 'dev') {
  // In development, use a global instance to avoid re-initialization
  // which can cause issues with Next.js hot-reloading.
  if (!(global as any).__aiInstance) {
    (global as any).__aiInstance = genkit({
      plugins: [
        googleAI(),
      ],
      logLevel: 'debug',
      enableTracingAndMetrics: true,
    });
  }
  aiInstance = (global as any).__aiInstance;
} else {
  // In production, create a new instance
  aiInstance = genkit({
    plugins: [
      googleAI(),
    ],
  });
}

export const ai = aiInstance;
