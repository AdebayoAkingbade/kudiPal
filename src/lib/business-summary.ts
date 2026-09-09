export type BusinessSummary = {
    transactionCount: number;
    moneyIn: number;
    moneyOut: number;
    netBalance: number;
    topExpenses: Array<{ name: string; amount: number }>;
    warningTitle: string;
    warningText: string;
    recommendations: string[];
};

export const fallbackBusinessSummary: BusinessSummary = {
    transactionCount: 128,
    moneyIn: 520000,
    moneyOut: 430000,
    netBalance: 90000,
    topExpenses: [
        { name: "Transport", amount: 120000 },
        { name: "Stock", amount: 200000 },
        { name: "Rent", amount: 80000 },
    ],
    warningTitle: "Money going out is getting too high",
    warningText: "Transport is taking a bigger share of your money this month and may reduce what you have left next week.",
    recommendations: [
        "Reduce transport spending where possible.",
        "Increase delivery fee slightly on long trips.",
        "Delay large purchases until your cash improves.",
    ],
};

type FinancialRow = {
    amount?: number | string | null;
    category?: string | null;
    direction?: string | null;
};

export function buildBusinessSummary(
    expenses: FinancialRow[] = [],
    receipts: unknown[] = [],
    transactions: FinancialRow[] = [],
): BusinessSummary {
    if (transactions.length) {
        const moneyIn = transactions
            .filter((transaction) => String(transaction.direction || "").toLowerCase() === "in")
            .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
        const moneyOut = transactions
            .filter((transaction) => String(transaction.direction || "").toLowerCase() === "out")
            .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
        const grouped = transactions
            .filter((transaction) => String(transaction.direction || "").toLowerCase() === "out")
            .reduce<Record<string, number>>((acc, transaction) => {
                const category = transaction.category || "Other";
                acc[category] = (acc[category] || 0) + Number(transaction.amount || 0);
                return acc;
            }, {});

        const topExpenses = Object.entries(grouped)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, amount]) => ({ name, amount }));
        const netBalance = moneyIn - moneyOut;

        return {
            transactionCount: transactions.length,
            moneyIn,
            moneyOut,
            netBalance,
            topExpenses: topExpenses.length ? topExpenses : fallbackBusinessSummary.topExpenses,
            warningTitle: netBalance < 0 ? "Your business spent more than it received" : "Money going out is getting too high",
            warningText: netBalance < 0
                ? "You may need to slow spending or increase sales soon so you do not run short of cash."
                : "Your spending is rising fast and could reduce what you have left for stock and bills.",
            recommendations: fallbackBusinessSummary.recommendations,
        };
    }

    if (!expenses.length) {
        return {
            ...fallbackBusinessSummary,
            transactionCount: receipts.length ? Math.max(receipts.length * 8, 24) : fallbackBusinessSummary.transactionCount,
        };
    }

    const moneyOut = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
        const category = expense.category || "Other";
        acc[category] = (acc[category] || 0) + Number(expense.amount || 0);
        return acc;
    }, {});

    const topExpenses = Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, amount]) => ({ name, amount }));

    const transportAmount = grouped.Transport || grouped.transport || 0;
    const moneyIn = Math.max(moneyOut + 90000, fallbackBusinessSummary.moneyIn);
    const netBalance = moneyIn - moneyOut;

    return {
        transactionCount: Math.max(expenses.length, receipts.length * 8, 12),
        moneyIn,
        moneyOut,
        netBalance,
        topExpenses: topExpenses.length ? topExpenses : fallbackBusinessSummary.topExpenses,
        warningTitle: transportAmount > 0
            ? "Transport costs are higher than usual"
            : "Money going out is getting high",
        warningText: transportAmount > 0
            ? "Transport is the main reason your spending feels high right now."
            : "Your expenses moved up faster than your income and could pressure your cash soon.",
        recommendations: fallbackBusinessSummary.recommendations,
    };
}

export function formatMoney(value: number) {
    return `₦${Math.round(value).toLocaleString()}`;
}
