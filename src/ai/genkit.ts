
import {genkit} from 'genkit';
import {openAI} from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
  model: 'gpt-4o',
});
