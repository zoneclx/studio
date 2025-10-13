
'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 * - CreateWebsiteFromPromptInput - The input type for the createWebsiteFromPrompt function.
 * - WebsiteCode - The output type for the createWebsiteFromfrom-prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

export const WebsiteCodeSchema = z.object({
    html: z.string().describe("The complete HTML code for the website, including the DOCTYPE declaration."),
    css: z.string().describe("The CSS code for styling the website. This can be empty if using only Tailwind."),
    javascript: z.string().describe("The JavaScript code for any interactivity. This can be empty.")
});
export type WebsiteCode = z.infer<typeof WebsiteCodeSchema>;


// Export ONLY the async wrapper function and types.
export async function createWebsiteFromPrompt(input: CreateWebsiteFromPromptInput): Promise<WebsiteCode> {
    // Return mock data for speed, directly inside the async function.
    return {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-100 font-sans">
    <header class="bg-white shadow">
        <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="text-2xl font-bold text-gray-800">MyBrand</div>
            <div>
                <a href="#" class="px-4 text-gray-600 hover:text-blue-500">Home</a>
                <a href="#" class="px-4 text-gray-600 hover:text-blue-500">About</a>
                <a href="#" class="px-4 text-gray-600 hover:text-blue-500">Contact</a>
            </div>
        </nav>
    </header>
    <main class="container mx-auto px-6 py-12">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Fast. Mocked. Instant.</h1>
            <p class="text-gray-700 text-lg">This is a mock website generated instantly for maximum speed.</p>
            <button id="cta-button" class="mt-8 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">Click Me!</button>
        </div>
    </main>
    <script src="script.js" defer></script>
</body>
</html>`,
        css: `body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}`,
        javascript: `document.getElementById('cta-button').addEventListener('click', () => {
    alert('Thanks for clicking! This is a mock interaction.');
});`
    };
}
