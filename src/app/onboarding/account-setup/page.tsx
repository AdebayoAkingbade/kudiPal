import { Suspense } from "react";
import { AuthEntry } from "@/components/auth/auth-entry";

export default function AccountSetupPage() {
    return (
        <Suspense fallback={<AccountSetupFallback />}>
            <AuthEntry
                title="Start with your phone number"
                description="Understand your business money in minutes. We&apos;ll send a quick code, then help you upload your statement and get simple insights on WhatsApp."
                footerText="Already have an account?"
                footerHref="/login"
                footerLabel="Sign in"
                showIntro={false}
            />
        </Suspense>
    );
}

function AccountSetupFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <p className="text-sm font-medium text-muted-foreground">Loading KudiPal account setup...</p>
        </div>
    );
}
