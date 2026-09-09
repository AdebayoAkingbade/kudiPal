import { TrendingDown, FileSpreadsheet, AlertTriangle } from "lucide-react";

export function ProblemSolution() {
    const problems = [
        {
            title: "No Financial Clarity",
            description: "You run overdrafts, cannot track debts, and wake up with panic attacks about your finances.",
            icon: <TrendingDown className="h-6 w-6 text-red-600" />,
            bg: "bg-red-50",
        },
        {
            title: "Manual Everything",
            description: "Spending hours reconciling payments and entering sales manually into spreadhseets.",
            icon: <FileSpreadsheet className="h-6 w-6 text-orange-600" />,
            bg: "bg-orange-50",
        },
        {
            title: "Missed Opportunities",
            description: "No credit history means no loans for expansion, helping you stay stuck in the same spot.",
            icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
            bg: "bg-yellow-50",
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-white" id="problem">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        The Problem We Solve
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        We have seen how Nigerian SMB owners struggle daily. KudiPal turns messy money admin into clear next steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((prob, idx) => (
                        <div key={idx} className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-card">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${prob.bg}`}>
                                {prob.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">{prob.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {prob.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
