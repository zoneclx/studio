
'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 */

import { createWebsiteFromPromptFlow } from '@/ai/dev';
import { CreateWebsiteFromPromptInput, WebsiteCode } from '@/ai/schemas';


export async function createWebsiteFromPrompt(input: CreateWebsiteFromPromptInput): Promise<WebsiteCode> {
  return createWebsiteFromPromptFlow(input);
}
