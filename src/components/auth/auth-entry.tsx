'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { fetchApi } from "@/lib/api";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";

type AuthEntryProps = {
    title: string;
    description: string;
    footerText: string;
    footerHref: string;
    footerLabel: string;
    showIntro?: boolean;
};

function normalizePhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "");

    if (!digits) return "";
    if (digits.startsWith("234")) return `+${digits}`;
    if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
    return `+234${digits}`;
}

function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function getFriendlyAuthError(error: unknown, provider?: 'google' | 'facebook') {
    const message = error instanceof Error ? error.message : String(error || "");
    const normalized = message.toLowerCase();

    if (normalized.includes("unsupported phone provider")) {
        return "Phone login is not enabled in your Supabase project. Please go to your Supabase Dashboard > Authentication > Providers > Phone and enable it, then configure an SMS provider.";
    }

    if (normalized.includes("provider is not enabled") || normalized.includes("unsupported provider")) {
        return `${provider === 'facebook' ? 'Facebook' : provider === 'google' ? 'Google' : 'This'} login is not enabled in your Supabase project. Please enable it in your Supabase Dashboard under Authentication > Providers.`;
    }

    if (normalized.includes("popup") || normalized.includes("redirect")) {
        return `We couldn't start ${provider ?? "social"} sign in. Please check that your Supabase redirect URLs (specifically ${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback) are configured correctly in the dashboard.`;
    }

    return message || "We couldn't complete sign in.";
}

export function AuthEntry({
    title,
    description,
    footerText,
    footerHref,
    footerLabel,
    showIntro = true,
}: AuthEntryProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    const e164Phone = useMemo(() => normalizePhoneNumber(phone), [phone]);
    const otpCode = otpDigits.join("");

    useEffect(() => {
        if (otpSent) {
            otpRefs.current[0]?.focus();
        }
    }, [otpSent]);

    useEffect(() => {
        const authError = searchParams.get("error");
        const authMessage = searchParams.get("message");

        if (authError === "oauth_callback") {
            setError(authMessage || "Google sign in did not finish. Please check your Supabase redirect URLs and Google provider settings.");
        }
    }, [searchParams]);

    useEffect(() => {
        if (otpSent && otpCode.length === 6 && otpDigits.every(Boolean) && !loading) {
            void handleVerifyOtp(otpCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpCode, otpDigits, otpSent, loading]);

    async function routeAfterAuth() {
        const profile = await fetchApi('/profiles/me').catch(() => null);
        if (!profile?.business_name) {
            router.push('/onboarding/business-info');
            return;
        }

        const receipts = await fetchApi('/receipts').catch(() => []);
        if (!receipts || receipts.length === 0) {
            router.push('/onboarding/upload-data');
            return;
        }

        router.push('/dashboard');
    }

    async function ensureProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;

        await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: fullName,
                email: user.email ?? null,
                phone_number: (user.phone ?? e164Phone) || null,
                whatsapp_number: e164Phone || user.phone || null,
            });
    }

    async function handleSendOtp(event?: React.FormEvent) {
        event?.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!e164Phone || e164Phone.length < 14) {
                throw new Error("Enter a valid Nigerian phone number.");
            }

            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: e164Phone,
            });

            if (otpError) throw otpError;
            setOtpSent(true);
            setOtpDigits(["", "", "", "", "", ""]);
        } catch (err: unknown) {
            setError(getFriendlyAuthError(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(code: string) {
        setLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone: e164Phone,
                token: code,
                type: 'sms',
            });

            if (verifyError) throw verifyError;

            await ensureProfile();
            await routeAfterAuth();
        } catch (err: unknown) {
            setError(getFriendlyAuthError(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleSocialLogin(provider: 'google' | 'facebook') {
        setLoading(true);
        setError(null);

        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("postAuthRedirect", "/onboarding/business-info");
            }

            const { data, error: authError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                throw authError;
            }

            if (data?.url && typeof window !== "undefined") {
                window.location.assign(data.url);
                return;
            }

            throw new Error(`${provider} sign in did not return a redirect URL.`);
        } catch (err: unknown) {
            setError(getFriendlyAuthError(err, provider));
            setLoading(false);
        }
    }

    function updateOtpDigit(index: number, value: string) {
        const nextValue = value.replace(/\D/g, "").slice(-1);
        const nextDigits = [...otpDigits];
        nextDigits[index] = nextValue;
        setOtpDigits(nextDigits);

        if (nextValue && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    }

    function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.12),_transparent_38%),linear-gradient(180deg,#f8f7f3_0%,#f2f6f5_100%)] px-4 py-8 sm:py-12">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                {showIntro ? (
                    <>
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                            <ChevronLeft className="h-4 w-4" />
                            Back to home
                        </Link>

                        <KudiPalLogo showSubtitle subtitle="Simple money help for your business" />
                    </>
                ) : null}

                <Card className="border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur">
                    <CardHeader className="space-y-3">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Phone first, with Google and Facebook too
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed text-slate-600">
                                {description}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {!otpSent ? (
                            <form className="space-y-4" onSubmit={handleSendOtp}>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input
                                        id="phone"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        placeholder="0801 234 5678"
                                        value={formatPhoneNumber(phone)}
                                        onChange={(event) => setPhone(event.target.value)}
                                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base"
                                    />
                                    <p className="text-xs text-slate-500">
                                        We&apos;ll send a 6-digit code to your phone.
                                    </p>
                                </div>

                                <Button type="submit" className="h-12 w-full rounded-2xl text-base font-semibold" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Send OTP
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Enter the 6-digit code</Label>
                                    <div className="grid grid-cols-6 gap-3">
                                        {otpDigits.map((digit, index) => (
                                            <Input
                                                key={index}
                                                ref={(element) => {
                                                    otpRefs.current[index] = element;
                                                }}
                                                value={digit}
                                                inputMode="numeric"
                                                maxLength={1}
                                                onChange={(event) => updateOtpDigit(index, event.target.value)}
                                                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                                className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-center text-xl font-semibold"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Code sent to {e164Phone || "your number"}.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 w-full rounded-2xl"
                                    onClick={() => setOtpSent(false)}
                                    disabled={loading}
                                >
                                    Change phone number
                                </Button>
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                <span className="bg-white px-3">or</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="h-12 rounded-2xl"
                                disabled={loading}
                                onClick={() => handleSocialLogin('google')}
                            >
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 rounded-2xl"
                                disabled={loading}
                                onClick={() => handleSocialLogin('facebook')}
                            >
                                Facebook
                            </Button>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            <div className="mb-1 flex items-center gap-2 font-semibold">
                                <ShieldCheck className="h-4 w-4" />
                                Your data is secure
                            </div>
                            We only use your data to analyze your transactions and send your business insights.
                        </div>

                        <p className="text-center text-sm text-slate-500">
                            {footerText}{" "}
                            <Link href={footerHref} className="font-semibold text-primary hover:underline">
                                {footerLabel}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
