'use client'

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const steps = [
    "Reading transactions",
    "Categorizing expenses",
    "Generating insights",
];

export default function ProcessingPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

    const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

    useEffect(() => {
        const stepTimer = window.setInterval(() => {
            setActiveStep((current) => Math.min(current + 1, steps.length - 1));
        }, 1200);

        const redirectTimer = window.setTimeout(() => {
            router.push('/onboarding/results');
        }, 4200);

        return () => {
            window.clearInterval(stepTimer);
            window.clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
            <div className="w-full rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold">Analyzing your business...</h1>
                <p className="mt-2 text-base text-white/70">
                    We&apos;re turning your uploads into a simple money summary.
                </p>

                <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-8 space-y-4">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className={`rounded-2xl px-4 py-3 text-sm transition ${index <= activeStep ? 'bg-white/10 text-white' : 'bg-white/5 text-white/45'}`}
                        >
                            {index <= activeStep ? "✔ " : "○ "}
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
