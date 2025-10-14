
'use server';
import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';
import { CreateWebsiteFromPromptInputSchema, WebsiteCodeSchema } from '@/ai/schemas';

import '@/ai/flows/improve-text-quality.ts';
import '@/ai/flows/generate-text-from-prompt.ts';
import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/diagnose-website-change.ts';
