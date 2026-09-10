'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fallbackBusinessSummary, formatMoney, type BusinessSummary } from "@/lib/business-summary";

export default function ResultsPage() {
    const router = useRouter();
    const [summary] = useState<BusinessSummary>(readStoredSummary);

    return (
        <div className="mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none bg-white shadow-lg">
                <CardContent className="space-y-8 p-8">
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Upload complete</p>
                        <h1 className="text-3xl font-bold text-slate-900">We found {summary.transactionCount} transactions</h1>
                        <p className="text-slate-600">Here&apos;s a quick look at what&apos;s happening in your business.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-emerald-50 p-5">
                            <p className="text-sm text-emerald-700">Money you made</p>
                            <p className="mt-2 text-3xl font-bold text-emerald-900">{formatMoney(summary.moneyIn)}</p>
                        </div>
                        <div className="rounded-3xl bg-red-50 p-5">
                            <p className="text-sm text-red-700">Money you spent</p>
                            <p className="mt-2 text-3xl font-bold text-red-900">{formatMoney(summary.moneyOut)}</p>
                        </div>
                    </div>

                    <Button className="h-12 w-full rounded-2xl text-base font-semibold" onClick={() => router.push('/dashboard')}>
                        View Business Health
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function readStoredSummary() {
    if (typeof window === "undefined") return fallbackBusinessSummary;

    try {
        const stored = localStorage.getItem("latestBusinessSummary");
        return stored ? JSON.parse(stored) as BusinessSummary : fallbackBusinessSummary;
    } catch {
        return fallbackBusinessSummary;
    }
}
