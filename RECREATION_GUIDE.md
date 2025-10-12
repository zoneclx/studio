# Prompt to Recreate the Monochrome AI Website Builder

Hello! I'd like you to build a complete web application called 'Monochrome AI'. It's a Next.js application that allows users to generate websites from a single text prompt.

**1. Technology Stack:**
*   **Framework:** Next.js with the App Router.
*   **Language:** TypeScript.
*   **UI Components:** ShadCN/UI. Please set up the standard components (Button, Card, Input, Textarea, Tabs, etc.).
*   **Styling:** Tailwind CSS. The theme should be dark by default.
*   **Icons:** Use `lucide-react`.
*   **Fonts:** Use `Inter` for the sans-serif font and `Space Grotesk` for the display font.

**2. Core AI Functionality (using placeholder functions):**
*   Create a server action `handleGeneration(prompt: string)` that takes a text prompt and returns mock HTML code for a website.
*   Create another server action `handleChat(text: string, image?: string)` that simulates an AI assistant responding to user queries about website changes.

**3. Pages & Features:**

*   **Homepage (`/`):**
    *   **Header:** Shows the app title "Monochrome AI" and a user profile icon that acts as a dropdown menu for logged-in users, or a "Sign Up" button for guests.
    *   **Main Content:** A large heading with a typewriter effect that animates the text: "Build a website with a single prompt." Below this, include a descriptive paragraph: "Monochrome AI is a powerful tool that allows you to generate beautiful, production-ready websites using simple text prompts. Describe your vision, and watch as our AI brings it to life, helping you refine and perfect your creation."
    *   **Buttons:** Two prominent buttons: "Start Creating" (links to `/create`) and "Try for Free" (links to `/try`).
    *   **Footer:** A simple footer with the text: "© 2025 Enzo Gimena's Ai, All rights reserved."

*   **Authentication Pages (`/login`, `/signup`):**
    *   Create simple `Card`-based forms for signing in and signing up.
    *   This should be a **simulated authentication system** using `localStorage` to store user credentials (email/password) and `sessionStorage` to manage the active user session. No real database or Firebase is needed for this part.

*   **Trial Page (`/try`):**
    *   This page is for guests and is a limited version of the main web builder.
    *   It should allow a maximum of **5 website generations** and **5 edits** using the AI assistant.
    *   These limits should be tracked in `localStorage` and **reset automatically every 24 hours**.
    *   Display the remaining uses clearly. When the limit is reached, show an alert dialog prompting the user to sign up.

*   **Web Builder Page (`/create`):**
    *   This page is for authenticated users only. If a guest tries to access it, redirect them to the signup page.
    *   It should feature a two-column layout.
        *   **Left Column:** A `Card` containing a `Textarea` for the user to describe the website. Include some example prompt buttons below it.
        *   **Right Column:** A `Card` with `Tabs` for "Preview" and "Code". The preview should be an `iframe` showing the generated website.
    *   An **AI Chat Assistant** component should appear *only after* the first website has been generated. This component allows users to describe changes and optionally upload an image.
    *   Include a "Restart" button that reverts the preview and prompt to the last successfully generated version.

*   **My Archive Page (`/my-work`):**
    *   Accessible only to logged-in users via the profile dropdown.
    *   When a user generates a website on the `/create` page, automatically save the latest version (HTML and prompt) to `localStorage`, tied to their user ID.
    *   This page should display the user's last saved creation, showing the prompt, a preview in an `iframe`, and a button to "Continue Editing" which takes them back to `/create` with that prompt loaded.

**4. Key Components:**
*   **`TypewriterEffect`:** A component that animates text as if it's being typed.
*   **`WebBuilder`:** The main component for the `/create` and `/try` pages, handling state for the prompt, output, and AI interactions.
*   **`AiChat`:** The chat interface component.
*   **`AuthProvider`:** A React context to manage the simulated user authentication state throughout the app.
