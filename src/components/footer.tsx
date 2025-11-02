
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

// A simple Github icon component
const GithubIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
);

const InstagramIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);


const footerNav = [
    {
      title: "Product",
      items: [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Editor", href: "/create" },
        { title: "Your Projects", href: "/my-archive" },
        { title: "Plugins", href: "/plugins" },
      ],
    },
    {
      title: "Community",
      items: [
        { title: "Shared Projects", href: "/under-development" },
        { title: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
];

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/zoneclx', icon: GithubIcon },
    { name: 'Facebook', href: 'https://www.facebook.com/enzodegimena.shawn', icon: FacebookIcon },
    { name: 'Instagram', href: 'https://www.instagram.com/enzogimena.shawn', icon: InstagramIcon },
]

export default function Footer() {
  return (
    <footer className={cn("relative z-10 border-t bg-background/80 backdrop-blur-lg")}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16">
                <div className="col-span-full lg:col-span-1">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold font-display">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Byte Studio
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">A powerful, AI-driven web builder.</p>
                </div>
                {footerNav.map((section) => (
                    <div key={section.title} className="text-sm">
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <ul className="mt-4 space-y-3">
                            {section.items.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t py-6">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Byte Studio, Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                            <span className="sr-only">{link.name}</span>
                            <link.icon className="h-5 w-5" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </footer>
  );
}
