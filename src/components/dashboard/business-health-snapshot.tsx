'use client'

import Link from "next/link";
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney, type BusinessSummary } from "@/lib/business-summary";

type BusinessHealthSnapshotProps = {
    summary: BusinessSummary;
};

export function BusinessHealthSnapshot({ summary }: BusinessHealthSnapshotProps) {
    const isWarning = summary.netBalance <= 0 || summary.moneyOut > summary.moneyIn * 0.8;

    return (
        <div className="space-y-5">
            <section className="rounded-[2rem] bg-[#0f172a] px-5 py-6 text-white shadow-2xl sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">Business health snapshot</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight">See your money clearly</h1>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                    Simple updates on money in, money out, and what is left for your business.
                </p>

                <div className="mt-5 grid gap-3">
                    <div className="rounded-3xl bg-emerald-500/10 p-4">
                        <p className="text-sm text-emerald-200">Money in</p>
                        <p className="mt-1 text-3xl font-bold">{formatMoney(summary.moneyIn)}</p>
                    </div>
                    <div className="rounded-3xl bg-rose-500/10 p-4">
                        <p className="text-sm text-rose-200">Money out</p>
                        <p className="mt-1 text-3xl font-bold">{formatMoney(summary.moneyOut)}</p>
                    </div>
                    <div className={`rounded-3xl p-4 ${summary.netBalance < 0 ? "bg-red-600/20 text-red-50" : "bg-white/10"}`}>
                        <p className="text-sm text-white/75">What is left</p>
                        <p className="mt-1 text-3xl font-bold">{formatMoney(summary.netBalance)}</p>
                    </div>
                </div>
            </section>

            <Card className="rounded-[2rem] border-none bg-white shadow-lg">
                <CardContent className="space-y-5 p-5">
                    <div className={`flex items-start gap-3 rounded-3xl border px-4 py-4 ${isWarning ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                        <div className={`rounded-full p-2 ${isWarning ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Warning</p>
                            <p className={`mt-1 text-lg font-semibold ${isWarning ? "text-red-700" : "text-amber-700"}`}>{summary.warningTitle}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{summary.warningText}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-slate-900">Biggest money out</p>
                            <p className="text-sm text-slate-500">{summary.transactionCount} records</p>
                        </div>

                        <div className="mt-3 space-y-3">
                            {summary.topExpenses.map((expense, index) => (
                                <div key={expense.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-slate-900">{expense.name}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{formatMoney(expense.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="h-12 rounded-2xl px-6 font-semibold">
                            <Link href="/dashboard/ask-ai">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Ask AI
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-12 rounded-2xl px-6">
                            <Link href="/dashboard/ai-insights">
                                See details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <p>🔒 Your data is secure</p>
                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                <p>🛡️ We do not share your data</p>
            </div>
        </div>
    );
}
