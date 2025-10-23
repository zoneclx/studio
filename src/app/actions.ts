
'use server';

import type { GenerateWebsiteOutput } from "./ai/flows/generate-website";

// This is a mock function that simulates generating a website.
// It returns a predefined set of files after a short delay.
export async function handleWebsiteGeneration(prompt: string): Promise<GenerateWebsiteOutput> {
  console.log(`Simulating website generation for prompt: ${prompt}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return a mock response. In a real scenario, this would be the AI's output.
  return {
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to Your AI-Generated Website!</h1>
        <p>Based on the prompt: "${prompt}"</p>
    </header>
    <main>
        <p>This is a placeholder for the content you wanted.</p>
        <p>The AI features are currently under development. This is a simulated response.</p>
    </main>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: 'style.css',
        language: 'css',
        content: `body { 
    font-family: sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 2rem;
    background-color: #f0f2f5;
    color: #333;
}
header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
`,
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `console.log("AI website script loaded. Features are under development.");`,
      },
    ],
  };
}

// This is a mock function that simulates an AI chat response.
export async function handleAiChat(text: string, image?: string): Promise<string> {
    console.log(`Simulating AI Chat response for: ${text}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let response = `This is a simulated AI response to your message: "${text}". The AI chat feature is currently under development.`;
    if(image) {
        response += " I have also 'received' the image you uploaded."
    }

    return response;
}
