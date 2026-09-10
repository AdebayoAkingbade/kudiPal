'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Info, Loader2, Lock, Plus, Smartphone, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { fallbackBusinessSummary } from "@/lib/business-summary";

export default function UploadDataPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [manualRows, setManualRows] = useState([
        { description: "", amount: "", type: "expense" },
    ]);

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/onboarding/account-setup');
                return;
            }
            setUserId(user.id);
        }

        void checkUser();
    }, [router]);

    function storeLatestSummary(summary = fallbackBusinessSummary) {
        if (typeof window !== "undefined") {
            localStorage.setItem("latestBusinessSummary", JSON.stringify(summary));
        }
    }

    async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files?.length || !userId) return;

        setUploading(true);
        setError(null);

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append('file', file);

                await fetchApi('/uploads', {
                    method: 'POST',
                    body: formData,
                });
            }

            const summary = {
                ...fallbackBusinessSummary,
                transactionCount: 128,
            };
            storeLatestSummary(summary);
            setUploadedFiles(Array.from(files).map((file) => file.name));
            router.push('/onboarding/processing');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleManualContinue() {
        const cleanRows = manualRows.filter((row) => row.description && row.amount);
        if (!cleanRows.length) {
            setError("Add at least one transaction or upload a file.");
            return;
        }

        const moneyOut = cleanRows
            .filter((row) => row.type === 'expense')
            .reduce((sum, row) => sum + Number(row.amount), 0);
        const moneyIn = cleanRows
            .filter((row) => row.type === 'income')
            .reduce((sum, row) => sum + Number(row.amount), 0);

        storeLatestSummary({
            ...fallbackBusinessSummary,
            transactionCount: cleanRows.length,
            moneyIn: moneyIn || fallbackBusinessSummary.moneyIn,
            moneyOut: moneyOut || fallbackBusinessSummary.moneyOut,
            netBalance: (moneyIn || fallbackBusinessSummary.moneyIn) - (moneyOut || fallbackBusinessSummary.moneyOut),
        });

        router.push('/onboarding/processing');
    }

    return (
        <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="border-none bg-white/90 shadow-lg">
                <CardContent className="space-y-8 p-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">Upload your bank statement or POS report</h1>
                        <p className="text-base text-slate-600">
                            Upload a PDF or CSV and we&apos;ll turn it into a simple business summary.
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-10 text-center transition hover:border-primary/40 hover:bg-slate-50"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.csv"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <UploadCloud className="h-8 w-8 text-primary" />}
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">{uploading ? "Uploading..." : "Drag and drop file"}</h2>
                        <p className="mt-2 text-sm text-slate-500">Supported: PDF, CSV</p>
                        <Button type="button" className="mt-6 h-11 rounded-2xl px-6">
                            {uploading ? "Processing..." : "Upload from phone"}
                        </Button>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                            {uploadedFiles.map((file) => (
                                <div key={file} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-emerald-700" />
                                        <span className="font-medium text-emerald-900">{file}</span>
                                    </div>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="rounded-3xl border border-slate-200 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-slate-900">Enter transactions manually</h3>
                        </div>

                        <div className="space-y-3">
                            {manualRows.map((row, index) => (
                                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px_120px]">
                                    <Input
                                        placeholder="Description"
                                        value={row.description}
                                        onChange={(event) => {
                                            const nextRows = [...manualRows];
                                            nextRows[index].description = event.target.value;
                                            setManualRows(nextRows);
                                        }}
                                        className="h-11 rounded-2xl"
                                    />
                                    <Input
                                        placeholder="Amount"
                                        inputMode="numeric"
                                        value={row.amount}
                                        onChange={(event) => {
                                            const nextRows = [...manualRows];
                                            nextRows[index].amount = event.target.value;
                                            setManualRows(nextRows);
                                        }}
                                        className="h-11 rounded-2xl"
                                    />
                                    <select
                                        value={row.type}
                                        onChange={(event) => {
                                            const nextRows = [...manualRows];
                                            nextRows[index].type = event.target.value;
                                            setManualRows(nextRows);
                                        }}
                                        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => setManualRows([...manualRows, { description: "", amount: "", type: "expense" }])}
                            >
                                Add row
                            </Button>
                            <Button type="button" className="rounded-2xl" onClick={handleManualContinue}>
                                Continue
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { title: "Bank statements", detail: "PDF or CSV", icon: FileText },
                            { title: "POS reports", detail: "Moniepoint, Opay, Paystack", icon: Smartphone },
                            { title: "Easy to retry", detail: "You can upload again anytime", icon: Info },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl bg-slate-50 p-4 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="font-semibold text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-blue-600 p-2 text-white">
                                <Lock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Your data is secure</p>
                                <p className="text-sm text-slate-600">We only analyze your transactions. We don&apos;t share your data.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
