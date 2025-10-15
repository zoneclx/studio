
'use client';

import AiChat from "@/components/ai-chat";

export default function ChatPage() {
    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <AiChat />
            </main>
        </div>
    );
}
