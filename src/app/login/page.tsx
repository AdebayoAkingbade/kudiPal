import { Suspense } from "react";
import { AuthEntry } from "@/components/auth/auth-entry";

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <AuthEntry
                title="Sign in in seconds"
                description="Use your phone number or continue with Google or Facebook to get back to your business summary."
                footerText="Need an account?"
                footerHref="/onboarding/account-setup"
                footerLabel="Start here"
            />
        </Suspense>
    );
}

function LoginFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <p className="text-sm font-medium text-muted-foreground">Loading KudiPal sign in...</p>
        </div>
    );
}
