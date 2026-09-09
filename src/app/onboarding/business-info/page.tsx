'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select-native";
import { fetchApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function BusinessInfoPage() {
    const router = useRouter();
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "",
        cac: "",
    });

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/onboarding/account-setup');
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                        email: user.email ?? null,
                        whatsapp_number: user.phone ?? null,
                    });
            }

            const profile = await fetchApi('/profiles/me').catch(() => null);
            if (profile?.business_name) {
                const receipts = await fetchApi('/receipts').catch(() => []);
                router.push(receipts?.length ? '/dashboard' : '/onboarding/upload-data');
                return;
            }

            if (profile) {
                setFormData({
                    businessName: profile.business_name || "",
                    businessType: profile.business_type || "",
                    cac: profile.cac_registration_number || "",
                });
            }

            setInitialLoading(false);
        }

        void loadProfile();
    }, [router]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await fetchApi('/profiles/me', {
                method: 'PUT',
                body: JSON.stringify({
                    business_name: formData.businessName,
                    business_type: formData.businessType,
                    cac_registration_number: formData.cac || null,
                }),
            });

            router.push('/onboarding/upload-data');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "We couldn't save your business details.");
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none bg-white/90 shadow-lg md:border">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-slate-900">Tell us about your business</CardTitle>
                    <CardDescription className="text-base text-slate-600">
                        Keep this under 30 seconds. We only need the basics to tailor your business summary.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">What&apos;s your business name?</Label>
                                <Input
                                    id="businessName"
                                    required
                                    placeholder="Crown Logistics Ltd"
                                    value={formData.businessName}
                                    onChange={(event) => setFormData({ ...formData, businessName: event.target.value })}
                                    className="h-12 rounded-2xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="businessType">What do you do?</Label>
                                <Select
                                    id="businessType"
                                    required
                                    value={formData.businessType}
                                    onChange={(event) => setFormData({ ...formData, businessType: event.target.value })}
                                    className="h-12 rounded-2xl"
                                >
                                    <option value="" disabled>Select business type</option>
                                    <option value="retail">Retail</option>
                                    <option value="food">Food</option>
                                    <option value="logistics">Logistics</option>
                                    <option value="services">Services</option>
                                    <option value="other">Other</option>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
                            <div className="mb-4 flex items-start gap-3">
                                <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-slate-900">Do you have CAC registration?</p>
                                    <p className="text-sm text-slate-600">Optional. You can skip this and add it later.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cac">CAC number</Label>
                                <Input
                                    id="cac"
                                    placeholder="RC1234567 or BN2345678"
                                    value={formData.cac}
                                    onChange={(event) => setFormData({ ...formData, cac: event.target.value })}
                                    className="h-12 rounded-2xl bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <Button type="button" variant="ghost" onClick={() => router.push('/onboarding/upload-data')}>
                                Skip
                            </Button>
                            <Button type="submit" className="h-12 rounded-2xl px-8 font-semibold" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Continue
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
