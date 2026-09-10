'use client'

import { useEffect, useState } from "react";
import { Lightbulb, TrendingUp, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buildBusinessSummary, fallbackBusinessSummary, type BusinessSummary } from "@/lib/business-summary";
import { fetchApi } from "@/lib/api";

const insightItems = [
    "Expenses increased by 18%",
    "Income is stable",
    "You may run low on cash in 2 weeks",
];

export default function AIInsightsPage() {
    const [summary, setSummary] = useState<BusinessSummary>(fallbackBusinessSummary);

    useEffect(() => {
        async function loadSummary() {
            const [expenses, receipts] = await Promise.all([
                fetchApi('/expenses').catch(() => []),
                fetchApi('/receipts').catch(() => []),
            ]);

            const nextSummary = buildBusinessSummary(expenses, receipts);
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("latestBusinessSummary");
                setSummary(stored ? JSON.parse(stored) : nextSummary);
            } else {
                setSummary(nextSummary);
            }
        }

        void loadSummary();
    }, []);

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">What we noticed</h1>
                        <p className="text-slate-600">Short, useful updates about your business money.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {insightItems.map((item, index) => (
                        <div key={item} className="flex items-start gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className={`rounded-full p-2 ${index === 2 ? 'bg-red-100 text-red-600' : index === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'}`}>
                                {index === 2 ? <TriangleAlert className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">{index + 1}. {item}</p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {index === 0 && "Your spending moved up faster than usual, so it is worth checking your biggest costs this week."}
                                    {index === 1 && "Money coming in is steady, which gives you room to fix cost issues before they become a bigger problem."}
                                    {index === 2 && "If spending stays at this level, your cash cushion may reduce quickly."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Card className="rounded-[2rem] border-none bg-slate-950 text-white shadow-2xl">
                <CardContent className="space-y-4 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Recommendation</p>
                    <h2 className="text-2xl font-bold">{summary.recommendations[0]}</h2>
                    <p className="text-white/70">
                        You can also {summary.recommendations[1].toLowerCase()} if transport or delivery costs keep rising.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
