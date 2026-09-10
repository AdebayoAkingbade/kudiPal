'use client'

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { BusinessHealthSnapshot } from "@/components/dashboard/business-health-snapshot";
import { buildBusinessSummary, fallbackBusinessSummary, type BusinessSummary } from "@/lib/business-summary";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
    const [summary, setSummary] = useState<BusinessSummary>(fallbackBusinessSummary);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSummary() {
            try {
                const [expenses, receipts, profile, transactions] = await Promise.all([
                    fetchApi('/expenses').catch(() => []),
                    fetchApi('/receipts').catch(() => []),
                    fetchApi('/profiles/me').catch(() => null),
                    fetchApi('/transactions').catch(() => []),
                ]);

                const nextSummary = buildBusinessSummary(expenses, receipts, transactions);

                if (typeof window !== "undefined") {
                    const stored = localStorage.getItem("latestBusinessSummary");
                    setSummary(stored ? JSON.parse(stored) : nextSummary);
                    localStorage.setItem("latestBusinessSummary", JSON.stringify(nextSummary));
                } else {
                    setSummary(nextSummary);
                }

                if (profile?.business_name) {
                    document.title = `${profile.business_name} | KudiPal`;
                }
            } finally {
                setLoading(false);
            }
        }

        void loadSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <BusinessHealthSnapshot summary={summary} />;
}
