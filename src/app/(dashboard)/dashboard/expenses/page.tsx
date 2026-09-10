"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import {
    Search,
    Filter,
    TrendingUp,
    CreditCard,
    Receipt,
    MoreHorizontal,
    Download,
    FileText,
    Plus,
    X,
    Brain,
    Landmark,
    CheckCircle2,
    Sparkles,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ExpenseRow = {
    merchant_name?: string | null;
    category?: string | null;
    transaction_date?: string | null;
    amount?: number | string | null;
};

type MonoInstance = {
    open: () => void;
};

async function loadExpenses() {
    const data = await fetchApi('/expenses') as ExpenseRow[] | null;
    return Array.isArray(data) ? data : [];
}

function totalExpenseAmount(expenses: ExpenseRow[]) {
    return expenses.reduce((acc, curr) => acc + parseExpenseAmount(curr.amount), 0);
}

function formatExpenseDate(value?: string | null) {
    if (!value) {
        return "No date";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
}

function parseExpenseAmount(value?: number | string | null) {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? amount : 0;
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [monoInstance] = useState<MonoInstance | null>(null);

    // Modal states
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAnalyze, setShowAnalyze] = useState(false);
    const [showConnectBank, setShowConnectBank] = useState(false);

    // Add Expense form
    const [newExpense, setNewExpense] = useState({
        merchant_name: '',
        category: 'General',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        { name: "Marketing", spent: 45000, color: "bg-blue-500", percentage: 22, trend: "+8%" },
        { name: "Inventory", spent: 125000, color: "bg-purple-500", percentage: 62, trend: "+3%" },
        { name: "Utilities", spent: 15000, color: "bg-green-500", percentage: 8, trend: "-5%" },
        { name: "Logistics", spent: 22000, color: "bg-orange-500", percentage: 12, trend: "+1%" },
    ];

    const categoryOptions = ["General", "Marketing", "Inventory", "Utilities", "Logistics", "Staff", "Rent", "Equipment", "Other"];

    const nigerianBanks = [
        { name: "Access Bank", logo: "🏦", color: "bg-red-50 border-red-200 text-red-700" },
        { name: "GTBank", logo: "🏦", color: "bg-orange-50 border-orange-200 text-orange-700" },
        { name: "Zenith Bank", logo: "🏦", color: "bg-blue-50 border-blue-200 text-blue-700" },
        { name: "First Bank", logo: "🏦", color: "bg-green-50 border-green-200 text-green-700" },
        { name: "UBA", logo: "🏦", color: "bg-red-50 border-red-200 text-red-700" },
        { name: "Sterling Bank", logo: "🏦", color: "bg-purple-50 border-purple-200 text-purple-700" },
    ];

    useEffect(() => {
        let isActive = true;

        void loadExpenses()
            .then((nextExpenses) => {
                if (!isActive) {
                    return;
                }

                setExpenses(nextExpenses);
                setTotalExpenses(totalExpenseAmount(nextExpenses));
            })
            .catch((err) => {
                console.error("Failed to fetch expenses:", err);
            });

        return () => {
            isActive = false;
        };
    }, []);

    const handleExport = () => {
        const rows = [
            ['Merchant', 'Category', 'Date', 'Amount (₦)'],
            ...expenses.map(e => [
                e.merchant_name || 'Vendor',
                e.category || 'General',
                formatExpenseDate(e.transaction_date),
                parseExpenseAmount(e.amount).toFixed(2)
            ])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleAddExpense = async () => {
        if (!newExpense.merchant_name || !newExpense.amount) {
            alert("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        try {
            await fetchApi('/expenses', {
                method: 'POST',
                body: JSON.stringify({
                    merchant_name: newExpense.merchant_name,
                    category: newExpense.category,
                    amount: parseFloat(newExpense.amount),
                    date: newExpense.transaction_date, // mapping to new entity logic
                }),
            });

            setShowAddExpense(false);
            setNewExpense({ merchant_name: '', category: 'General', amount: '', transaction_date: new Date().toISOString().split('T')[0] });
            const nextExpenses = await loadExpenses();
            setExpenses(nextExpenses);
            setTotalExpenses(totalExpenseAmount(nextExpenses));
        } catch (error: unknown) {
            alert(`Error: ${error instanceof Error ? error.message : "Expense could not be saved."}`);
        }
        setSubmitting(false);
    };

    const filteredExpenses = expenses.filter(e =>
        (e.merchant_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Expenses Analysis</h1>
                    <p className="text-slate-500">Keep track of your spending and identify cost-saving opportunities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowAddExpense(true)}>
                        <Plus className="h-4 w-4" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">High</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Spent (MTD)</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₦{totalExpenses.toLocaleString() || '124,500'}</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">AI Ready</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Scanned Receipts</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length || '12'} <span className="text-sm font-medium text-slate-400">documents</span></p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">-12% Saved</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Saving Potential</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₦42,000</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle>Transaction History</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search expenses..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" /> Filter
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Transaction</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredExpenses.length > 0 ? (
                                            filteredExpenses.map((exp, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                                                <FileText className="h-4 w-4 text-slate-500" />
                                                            </div>
                                                            <span className="font-bold text-sm text-slate-900">{exp.merchant_name || 'Vendor'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                                                            {exp.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {formatExpenseDate(exp.transaction_date)}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-sm text-slate-900">
                                                        ₦{parseExpenseAmount(exp.amount).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Receipt className="h-10 w-10 text-slate-300 mb-2" />
                                                        <p className="text-slate-500 font-medium italic">No expenses recorded yet.</p>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-4"
                                                            onClick={() => setShowAddExpense(true)}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" /> Add First Expense
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Area */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {categories.map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-600">{cat.name.toUpperCase()}</span>
                                        <span className="text-slate-900">₦{cat.spent.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full text-xs font-bold py-6 border-dashed border-2 hover:border-primary hover:text-primary transition-all"
                                onClick={() => setShowAnalyze(true)}
                            >
                                Analyze All Categories
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                        <CardContent className="p-6 relative z-10">
                            <h4 className="font-bold text-lg mb-2">Automate Expenses</h4>
                            <p className="text-white/80 text-xs mb-6 leading-relaxed">
                                Connect your bank account to automatically import and categorize every transaction with 99% accuracy.
                            </p>
                            <Button
                                className="w-full bg-white text-indigo-700 hover:bg-white/90 font-bold transition-transform hover:scale-105"
                                onClick={() => setShowConnectBank(true)}
                            >
                                Connect Bank Now
                            </Button>
                        </CardContent>
                        <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-[-40px] left-[-20px] h-48 w-48 bg-white/5 rounded-full blur-2xl"></div>
                    </Card>
                </div>
            </div>

            {/* ─── Add Expense Modal ─── */}
            {showAddExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Add Expense</CardTitle>
                                    <CardDescription>Record a new business expense</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddExpense(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant / Vendor Name *</label>
                                <Input
                                    placeholder="e.g. Ahmed Supplies"
                                    value={newExpense.merchant_name}
                                    onChange={e => setNewExpense({ ...newExpense, merchant_name: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                    <div className="relative">
                                        <select
                                            value={newExpense.category}
                                            onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                            className="w-full h-11 pl-4 pr-8 border rounded-md text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                                        >
                                            {categoryOptions.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (₦) *</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                                <Input
                                    type="date"
                                    value={newExpense.transaction_date}
                                    onChange={e => setNewExpense({ ...newExpense, transaction_date: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowAddExpense(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    onClick={handleAddExpense}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : 'Save Expense'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Analyze All Categories Modal ─── */}
            {showAnalyze && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/30 rounded-xl flex items-center justify-center">
                                        <Brain className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">AI Category Analysis</CardTitle>
                                        <CardDescription className="text-slate-400">Smart insights on your spending</CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={() => setShowAnalyze(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {categories.map((cat, i) => {
                                const insights = [
                                    "Your marketing spend is 15% above industry average. Consider reallocating to higher-ROI channels.",
                                    "Inventory purchases are optimized but bulk buying discounts are unavailable. Negotiate quarterly contracts.",
                                    "Utilities cost is below average — great efficiency! No action needed.",
                                    "Logistics costs are steady but 2 late deliveries this month add invisible costs."
                                ];
                                return (
                                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`}></span>
                                                <h5 className="font-bold text-sm text-slate-900">{cat.name}</h5>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900">₦{cat.spent.toLocaleString()}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.trend.startsWith('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                    {cat.trend}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full mb-3 overflow-hidden">
                                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                                            <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                            {insights[i]}
                                        </p>
                                    </div>
                                );
                            })}
                            <Button className="w-full bg-primary hover:bg-primary/90 mt-2" onClick={() => setShowAnalyze(false)}>
                                Got It
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Connect Bank Modal ─── */}
            {showConnectBank && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Landmark className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Connect Your Bank</CardTitle>
                                        <CardDescription>Auto-import all transactions securely via Mono</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowConnectBank(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <p className="text-sm text-slate-500 text-center mb-2">We support all major Nigerian banks through our secure partner, Mono.</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6 relative">
                                {/* Visual fade overlay for bank list */}
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                                {nigerianBanks.slice(0, 4).map((bank, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold opacity-70 grayscale hover:grayscale-0 ${bank.color}`}
                                    >
                                        <span className="text-xl">{bank.logo}</span>
                                        <span>{bank.name}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-200"
                                onClick={() => {
                                    if (monoInstance) {
                                        monoInstance.open();
                                    } else {
                                        alert("Mono is not configured. Please add NEXT_PUBLIC_MONO_PUBLIC_KEY to .env.local");
                                    }
                                }}
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" /> Proceed with Mono
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>
    );
}
