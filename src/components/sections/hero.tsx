import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-primary pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center md:text-left">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-center md:items-start space-y-8 animate-in slide-in-from-left duration-500">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
                            New: Whatsapp Integration
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Your AI Operations Manager in Your <span className="text-secondary">Pocket</span>
                        </h1>

                        <p className="max-w-xl text-lg md:text-xl text-white/80 leading-relaxed">
                            The first AI agent dedicated to helping African SMBs run operations, cut costs, and grow profits on Autopilot.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link href="/onboarding/account-setup">
                                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold h-14 px-8 w-full sm:w-auto">
                                    Start Free Trial
                                </Button>
                            </Link>
                             <Link href="#demo">
                                <Button
                                    size="lg"
                                    className="bg-[#0f766e] text-white hover:bg-[#0d685f] h-14 px-8 gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    <PlayCircle className="h-5 w-5" />
                                    Watch Demo
                                </Button>
                             </Link>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/60 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-gray-300"></div>
                                ))}
                            </div>
                            <span>Trusted by 500+ Businesses</span>
                        </div>
                    </div>

                     <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none animate-in slide-in-from-right duration-700 delay-100">
                        <div className="relative rounded-3xl border border-white/15 bg-white/8 backdrop-blur-lg p-5 shadow-[0_30px_120px_rgba(0,0,0,0.25)] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-primary/10 to-transparent rounded-3xl"></div>
                            <div className="grid gap-4">
                                <div className="rounded-2xl bg-white/90 text-slate-900 p-4 shadow-lg border border-white/40">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-600">Today’s Health</p>
                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Stable</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="rounded-xl bg-emerald-50 p-3">
                                            <p className="text-xs text-emerald-700">Revenue</p>
                                            <p className="text-lg font-bold text-emerald-900">₦1.25M</p>
                                            <p className="text-[11px] text-emerald-700/80">+12.5%</p>
                                        </div>
                                        <div className="rounded-xl bg-amber-50 p-3">
                                            <p className="text-xs text-amber-700">Expenses</p>
                                            <p className="text-lg font-bold text-amber-900">₦560k</p>
                                            <p className="text-[11px] text-amber-700/80">-4.1%</p>
                                        </div>
                                        <div className="rounded-xl bg-blue-50 p-3">
                                            <p className="text-xs text-blue-700">Net</p>
                                            <p className="text-lg font-bold text-blue-900">₦690k</p>
                                            <p className="text-[11px] text-blue-700/80">+8.4%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/20 bg-slate-900/60 text-white p-4 shadow-inner">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-white/80">Cash Flow (7d)</p>
                                        <span className="text-xs text-emerald-200">Updated 3 mins ago</span>
                                    </div>
                                    <div className="h-28 w-full bg-gradient-to-r from-emerald-900/50 via-emerald-700/40 to-emerald-500/30 rounded-xl flex items-end gap-1 p-2">
                                        {[35,45,30,60,50,80,70].map((v,i)=>(
                                            <div key={i} className="flex-1 bg-emerald-400/70 rounded-t-lg" style={{height:`${v}%`}}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur p-4 shadow-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">WhatsApp daily brief</p>
                                        <p className="text-base font-semibold text-slate-900">Sent 6:00 AM • 3 insights</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        Live
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
                            <div className="absolute -top-10 -left-10 h-40 w-40 bg-primary/25 blur-3xl rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
