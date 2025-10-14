
'use server';

import { ai } from '@/ai/genkit';
import { WebsiteGenInputSchema, WebsiteGenOutputSchema, type WebsiteGenInput, type WebsiteGenOutput } from '@/ai/schemas';

export async function generateWebsite(
  input: WebsiteGenInput
): Promise<WebsiteGenOutput> {
    const { text } = await ai.generate({
        model: 'gemini-pro',
        prompt: `Generate a single-page HTML website based on this prompt: "${input.prompt}". The response MUST be a single, complete HTML document. Inline all CSS using a <style> tag. Use Tailwind CSS via the CDN: <script src="https://cdn.tailwindcss.com"></script>. Your entire response must be a valid JSON object with a single key "html".`,
        config: {
            temperature: 0.7,
        },
    });

    try {
        // Clean the raw text response to make it valid JSON
        let cleanedText = text;
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
        }
        
        const parsed = JSON.parse(cleanedText);
        
        if (parsed && parsed.html) {
            return { html: parsed.html };
        }
        throw new Error("Parsed JSON does not contain 'html' property.");

    } catch (e) {
        console.error("Failed to parse AI response, returning fallback HTML.", e);
        // If parsing fails, wrap the raw text in a basic HTML structure as a fallback.
        const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
    <title>AI Response Fallback</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8 font-sans">
    <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-red-600 mb-4">Error Parsing AI Response</h1>
        <p class="text-gray-700 mb-2">The AI generated a response, but it was not in the expected format. The raw output is displayed below.</p>
        <pre class="bg-gray-200 text-gray-800 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">${text}</pre>
    </div>
</body>
</html>`;
        return { html: fallbackHtml };
    }
}
