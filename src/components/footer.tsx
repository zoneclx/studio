
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

// A simple Twitter/X icon component
const TwitterIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 1200 1227" fill="none" aria-hidden="true" {...props}>
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L112.383 44.0126H302.542L604.45 507.459L651.918 575.353L1093.53 1181.99H903.373L569.165 687.854V687.828Z" fill="currentColor"></path>
    </svg>
);

// A simple Discord icon component
const DiscordIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M20.317 4.3698C18.698 3.5048 16.929 2.8748 15.093 2.5008C15.029 2.6808 14.962 2.8598 14.893 3.0378C13.821 4.5418 12.879 5.8648 12 7.0568C11.121 5.8648 10.179 4.5418 9.107 3.0378C9.038 2.8598 8.971 2.6808 8.907 2.5008C7.071 2.8748 5.302 3.5048 3.683 4.3698C0.633 9.2088 0 14.4958 1.157 19.5258C3.122 20.9578 5.152 21.9888 7.265 22.6228C7.611 22.0918 7.925 21.5368 8.208 20.9578C7.712 20.6978 7.234 20.4138 6.78 20.0938C6.924 20.0108 7.065 19.9218 7.202 19.8278C10.223 21.6138 13.777 21.6138 16.798 19.8278C16.935 19.9218 17.076 20.0108 17.22 20.0938C16.766 20.4138 16.288 20.6978 15.792 20.9578C16.075 21.5368 16.389 22.0918 16.735 22.6228C18.848 21.9888 20.878 20.9578 22.843 19.5258C24.08 13.7668 23.185 8.5258 20.317 4.3698ZM8.02 15.3318C7.076 15.3318 6.283 14.5008 6.283 13.5078C6.283 12.5158 7.076 11.6838 8.02 11.6838C8.964 11.6838 9.757 12.5158 9.757 13.5078C9.757 14.5008 8.964 15.3318 8.02 15.3318ZM15.98 15.3318C15.036 15.3318 14.243 14.5008 14.243 13.5078C14.243 12.5158 15.036 11.6838 15.98 11.6838C16.924 11.6838 17.717 12.5158 17.717 13.5078C17.717 14.5008 16.924 15.3318 15.98 15.3318Z"></path>
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
    { name: 'GitHub', href: '#', icon: GithubIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
    { name: 'Discord', href: '#', icon: DiscordIcon },
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
                        <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
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
