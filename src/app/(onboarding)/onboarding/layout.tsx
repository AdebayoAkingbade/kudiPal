import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";
import { OnboardingLayoutClient } from "./layout-client";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header */}
            <header className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex items-center gap-5">
                    <KudiPalLogo compact />
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            <OnboardingLayoutClient>
                {children}
            </OnboardingLayoutClient>
        </div>
    );
}
