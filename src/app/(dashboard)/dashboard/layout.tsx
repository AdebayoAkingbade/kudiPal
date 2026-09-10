'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MessageSquare, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";

const navItems = [
    { href: "/dashboard", label: "Business Health", icon: Wallet },
    { href: "/dashboard/ai-insights", label: "What We Noticed", icon: Sparkles },
    { href: "/dashboard/ask-ai", label: "Ask AI", icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setReady(true);
        }

        void checkSession();
    }, [router]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push('/');
    }

    if (!ready) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#eef4f3_100%)]">
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <KudiPalLogo compact showSubtitle subtitle="A smart friend for your business money" />
                    </Link>

                    <Button variant="ghost" size="sm" className="rounded-2xl text-slate-600" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </div>
            </header>

            <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
                <nav className="grid gap-3 sm:grid-cols-3">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-3xl border px-4 py-4 text-sm font-semibold transition ${active ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-white/70 bg-white text-slate-700 hover:border-slate-200'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {children}
            </main>
        </div>
    );
}
