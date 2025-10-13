
'use server';

import { streamWebsiteFromPrompt } from '@/ai/flows/create-website-from-prompt';
import { diagnoseWebsiteChange } from '@/ai/flows/diagnose-website-change';
import { categorizeChatRequest } from '@/ai/flows/categorize-chat-request';

// This function now returns a ReadableStream for the client to consume.
export async function handleGeneration(
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  try {
    const stream = streamWebsiteFromPrompt({ prompt });

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
    const encoder = new TextEncoder();
    return new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(JSON.stringify({ error: 'Failed to process the request. Please try again.' })));
            controller.close();
        }
    });
  }
}


export async function handleChat(
  text: string,
  image?: string
): Promise<{ response: string; error?: undefined; } | { error: string; response?: undefined }> {
  try {
    const response = await diagnoseWebsiteChange({ text, image });
     return { response };
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
            const chatResult = await handleChat(text, image);
            return {
                ...result,
                response: chatResult.response,
                error: chatResult.error
            };
        }

        return result;
    } catch (error) {
        console.error('AI categorization failed:', error);
        return { category: 'general_inquiry', error: 'Failed to process the request. Please try again.' };
    }
}
