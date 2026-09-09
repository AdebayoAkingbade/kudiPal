import Link from "next/link";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navigation = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/whatsapp", label: "WhatsApp" },
    { href: "/security", label: "Security" },
    { href: "/scale", label: "Scale" },
];

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" aria-label="KudiPal home">
                    <KudiPalLogo compact />
                </Link>

                <nav className="hidden md:flex gap-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Log in
                    </Link>
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
