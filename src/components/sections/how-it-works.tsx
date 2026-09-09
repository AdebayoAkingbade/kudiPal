import { UploadCloud, Sparkles, MessageSquare } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            step: 1,
            title: "Upload Your Data",
            description: "Snap and upload your invoices, receipts, and POS reports via WhatsApp or our web app.",
            icon: <UploadCloud className="h-6 w-6 text-purple-600" />,
            bg: "bg-purple-100",
            border: "border-purple-200",
        },
        {
            step: 2,
            title: "AI Analyzes Everything",
            description: "Our AI accountant reads your receipts, categorizes expenses, and reconciles payments in the background.",
            icon: <Sparkles className="h-6 w-6 text-blue-600" />,
            bg: "bg-blue-100",
            border: "border-blue-200",
        },
        {
            step: 3,
            title: "Get Insights on WhatsApp",
            description: "Receive daily profit summaries, expense alerts, and growth tips directly on WhatsApp.",
            icon: <MessageSquare className="h-6 w-6 text-green-600" />,
            bg: "bg-green-100",
            border: "border-green-200",
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-gray-50" id="how-it-works">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        We have simplified the process to 3 simple steps so you can focus on your business.
                    </p>
                </div>

                 <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {steps.map((item) => (
                        <div key={item.step} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute -top-5 left-8 bg-primary text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                {item.step}
                            </div>
                            
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mt-4 ${item.bg} group-hover:bg-opacity-80 transition-colors`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
