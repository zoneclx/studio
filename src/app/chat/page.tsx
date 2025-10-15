
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                            <Wrench className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-display">Feature Under Construction</CardTitle>
                        <CardDescription>
                            This feature has been temporarily disabled for improvements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/">
                            <Button>Go to Homepage</Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
