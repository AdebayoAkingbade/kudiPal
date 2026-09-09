import { CheckCircle2 } from "lucide-react";

export function WhatsAppFeature() {
    const benefits = [
        "Receive daily business updates",
        "Track sales and expenses easily",
        "Get low stock alerts instantly",
        "Conversation feels like a human chat"
    ];

    return (
        <section className="py-20 md:py-28 bg-green-50/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                            Most Popular
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            WhatsApp Weekly Summaries
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Do not have time to log into a dashboard? No problem. Get a full weekly breakdown of your business performance sent directly to your WhatsApp.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
                            Get Started on WhatsApp
                        </button>
                    </div>

                    <div className="flex-1 relative w-full flex justify-center lg:justify-end">

                        <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-8 bg-black z-20 flex justify-center">
                                <div className="w-1/3 h-6 bg-black rounded-b-xl"></div>
                            </div>
                            <div className="bg-[#ECE5DD] w-full h-full pt-10 px-4 overflow-hidden flex flex-col gap-4">
                                
                                <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm">
                                    <p className="font-semibold text-green-600 mb-1">KudiPal</p>
                                    <p>Good morning! ☀️ Here is your summary for last week (Aug 12 - Aug 18):</p>
                                    <p className="mt-2 font-mono text-xs">
                                        💰 Revenue: ₦450,000<br />
                                        📉 Expenses: ₦120,000<br />
                                        ✅ Profit: ₦330,000
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500 text-right">09:01 AM</p>
                                </div>

                                <div className="self-end bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm">
                                    <p>This is great! How does this compare to lower sales last month?</p>
                                    <p className="mt-1 text-xs text-gray-500 text-right">09:05 AM</p>
                                </div>

                                <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm">
                                    <p>You are up 25%! Your new &quot;Bundle Deal&quot; strategy is working well. Keep it up!</p>
                                    <p className="mt-1 text-xs text-gray-500 text-right">09:06 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
