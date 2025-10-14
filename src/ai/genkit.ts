
'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {firebaseGenkit} from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [googleAI()],
});
