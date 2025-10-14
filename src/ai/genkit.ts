
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkitx} from 'genkitx-openai';

export const ai = genkit({
  plugins: [googleAI()],
});
