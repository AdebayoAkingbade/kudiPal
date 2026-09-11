'use client'

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, X } from "lucide-react";

type Tutorial = {
    title: string;
    description: string;
    img: string;
    steps: string[];
    action: string;
};

export function VideoDemo() {
    const router = useRouter();
    const tutorials: Tutorial[] = [
        {
            title: "Daily AI Insights",
            description: "KudiPal automatically scans your POS and bank data every 24 hours.",
            img: "/images/tutorial-insights.png",
            steps: [
                "Real-time monitoring of POS transactions.",
                "Automatic categorization of business expenses.",
                "Daily WhatsApp summary sent directly to your phone."
            ],
            action: "Connect WhatsApp"
        },
        {
            title: "Automated Profit Reports",
            description: "No more manual bookkeeping. Get accurate margin calculations instantly.",
            img: "/images/tutorial-reports.png",
            steps: [
                "Automatic calculation of Net Profit vs Gross Margin.",
                "Visual charts showing growth trends over time.",
                "End-of-month financial statements generated in seconds."
            ],
            action: "Upload Receipts"
        },
        {
            title: "Smart Inventory Setup",
            description: "Sync your physical stock with your digital storefront effortlessly.",
            img: "/images/tutorial-setup.png",
            steps: [
                "Photograph your products to add them instantly via AI.",
                "Automated stock level alerts to prevent out-of-stock.",
                "Seamless integration with WhatsApp for easy sales."
            ],
            action: "Setup Items"
        }
    ];

    const [activeTutorial, setActiveTutorial] = useState(tutorials[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = (tutorial: Tutorial) => {
        setActiveTutorial(tutorial);
        setIsPlaying(true);
    };

    return (
        <section className="py-20 bg-white" id="demo">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        See <span className="text-primary">KudiPal</span> in Action
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Watch how Nigerian SMBs are automating their operations, cutting costs, and growing profits in minutes.
                    </p>
                </div>

                <div
                    onClick={() => handlePlay(tutorials[0])}
                    className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video mb-12 group cursor-pointer border-4 border-white shadow-purple-500/20"
                >
                    <Image
                        src="/images/tutorial-insights.png"
                        alt="Daily AI Insights"
                        fill
                        sizes="(min-width: 1024px) 896px, 100vw"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-2xl">
                                <Play className="h-6 w-6 text-primary fill-primary" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-8 text-left">
                        <div className="inline-flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg">
                            Featured Tutorial
                        </div>
                        <p className="text-white font-bold text-3xl mb-1 tracking-tight">Daily AI Insights</p>
                        <p className="text-white/70 text-base max-w-md font-medium">See how KudiPal transforms your raw business data into actionable growth strategies.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {tutorials.map((tutorial, i) => (
                        <div
                            key={i}
                            onClick={() => handlePlay(tutorial)}
                            className="rounded-2xl overflow-hidden bg-gray-900 aspect-video relative group cursor-pointer hover:ring-4 hover:ring-primary/40 transition-all shadow-xl"
                        >
                            <Image
                                src={tutorial.img}
                                alt={tutorial.title}
                                fill
                                sizes="(min-width: 768px) 33vw, 100vw"
                                className="object-cover opacity-50 group-hover:opacity-80 transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white transition-all transform group-hover:scale-110 shadow-xl">
                                    <Play className="h-4 w-4 text-white group-hover:text-primary fill-white group-hover:fill-primary" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 text-left">
                                <p className="text-white font-bold text-sm tracking-tight">{tutorial.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interactive Walkthrough Modal */}
                {isPlaying && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300 p-4 md:p-10 backdrop-blur-sm">
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full backdrop-blur-md z-[110] border border-white/20 hover:scale-110"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative w-full max-w-6xl flex flex-col md:flex-row bg-[#0A0A0A] rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.3)] border border-white/10 animate-in zoom-in-95 duration-500">
                            {/* Left side: Visual Mockup */}
                            <div className="flex-1 relative aspect-video md:aspect-auto bg-black p-4 md:p-12">
                                <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-30"></div>
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 group">
                                    <Image
                                        src={activeTutorial.img}
                                        alt={activeTutorial.title}
                                        fill
                                        sizes="(min-width: 768px) 65vw, 100vw"
                                        className="object-contain animate-in fade-in zoom-in-110 duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>
                            </div>

                            {/* Right side: Info and Steps */}
                            <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                        Interactive Tutorial
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
                                        {activeTutorial.title}
                                    </h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        {activeTutorial.description}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-6">
                                    {activeTutorial.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group animate-in slide-in-from-right-4 duration-500 delay-150" style={{ animationDelay: `${idx * 150}ms` }}>
                                            <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <p className="text-white/80 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
                                    <button
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                                        onClick={() => router.push('/onboarding/account-setup')}
                                    >
                                        {activeTutorial.action}
                                    </button>
                                    <p className="text-center text-white/30 text-[10px] uppercase font-bold tracking-widest">
                                        Ready to scale your business?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
