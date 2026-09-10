'use client'

import { useEffect, useState } from "react";
import { Bot, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBusinessSummary, fallbackBusinessSummary, formatMoney, type BusinessSummary } from "@/lib/business-summary";
import { fetchApi } from "@/lib/api";

const prompts = [
    "Why are my expenses high?",
    "Can I afford to restock?",
    "What is my busiest day?",
];

function answerQuestion(question: string, summary: BusinessSummary) {
    if (question.toLowerCase().includes("restock")) {
        return `Based on your current cash (${formatMoney(summary.netBalance)}), you can restock small items. Avoid large purchases this week.`;
    }
    if (question.toLowerCase().includes("expenses")) {
        return `Your transport costs increased the most this week. That is the main reason your spending feels high right now.`;
    }
    return `Your strongest activity is likely on the days when money coming in is steady and transport costs stay low. Upload more weekly data to make this answer sharper.`;
}

export default function AskAIPage() {
    const [summary, setSummary] = useState<BusinessSummary>(fallbackBusinessSummary);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

    useEffect(() => {
        async function loadSummary() {
            const [expenses, receipts, transactions] = await Promise.all([
                fetchApi('/expenses').catch(() => []),
                fetchApi('/receipts').catch(() => []),
                fetchApi('/transactions').catch(() => []),
            ]);

            const nextSummary = buildBusinessSummary(expenses, receipts, transactions);
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("latestBusinessSummary");
                setSummary(stored ? JSON.parse(stored) : nextSummary);
            } else {
                setSummary(nextSummary);
            }
        }

        void loadSummary();
    }, []);

    function submitQuestion(nextQuestion: string) {
        if (!nextQuestion.trim()) return;

        setMessages([
            { role: "user", text: nextQuestion },
            { role: "assistant", text: answerQuestion(nextQuestion, summary) },
        ]);
        setQuestion("");
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-[2rem] border-none bg-white shadow-lg">
                <CardContent className="space-y-5 p-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ask about your business</h1>
                        <p className="text-slate-600">Start with a simple question. No accounting jargon needed.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {prompts.map((prompt) => (
                            <Button
                                key={prompt}
                                type="button"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => submitQuestion(prompt)}
                            >
                                {prompt}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <input
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            placeholder="Ask a business question"
                            className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
                        />
                        <Button className="h-12 rounded-2xl px-5" onClick={() => submitQuestion(question)}>
                            <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {messages.length > 0 && (
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <Card
                            key={`${message.role}-${index}`}
                            className={`rounded-[2rem] border-none shadow-sm ${message.role === 'assistant' ? 'bg-slate-950 text-white' : 'bg-white'}`}
                        >
                            <CardContent className="flex gap-4 p-5">
                                <div className={`mt-1 rounded-2xl p-2 ${message.role === 'assistant' ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                                        {message.role === 'assistant' ? 'AI' : 'You'}
                                    </p>
                                    <p className="mt-2 leading-relaxed">{message.text}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
