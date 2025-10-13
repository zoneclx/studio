'use server';

import { streamWebsiteFromPrompt } from '@/ai/flows/create-website-from-prompt';
import { diagnoseWebsiteChange } from '@/ai/flows/diagnose-website-change';
import { categorizeChatRequest } from '@/ai/flows/categorize-chat-request';

// This function now returns a ReadableStream for the client to consume.
export async function handleGeneration(
  prompt: string
): Promise<ReadableStream<string> | { error: string }> {
  try {
    const stream = await (async function* () {
      for await (const part of streamWebsiteFromPrompt({ prompt })) {
        yield part;
      }
    })();

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const part of stream) {
          controller.enqueue(encoder.encode(part));
        }
        controller.close();
      },
    });

    return readableStream;
  } catch (error) {
    console.error('AI generation failed:', error);
    return { error: 'Failed to process the request. Please try again.' };
  }
}

type ChatResult = {
  response?: string;
  error?: string;
};

export async function handleChat(
  text: string,
  image?: string
): Promise<ChatResult> {
  try {
    const result = await diagnoseWebsiteChange({ text, image });
    return { response: result.response };
  } catch (error) {
    console.error('AI chat failed:', error);
    return { error: 'Failed to get a response. Please try again.' };
  }
}

type CategorizationResult = {
  category: 'code_request' | 'general_inquiry';
  prompt?: string;
  response?: string;
  error?: string;
};

export async function handleCategorization(
  text: string,
  image?: string
): Promise<CategorizationResult> {
    try {
        const result = await categorizeChatRequest({ text });

        if (result.category === 'general_inquiry') {
            const chatResult = await diagnoseWebsiteChange({ text, image });
            return {
                ...result,
                response: chatResult.response,
            };
        }

        return result;
    } catch (error) {
        console.error('AI categorization failed:', error);
        return { category: 'general_inquiry', response: 'Sorry, I had trouble understanding that. Could you try again?', error: 'Failed to process the request. Please try again.' };
    }
}
