'use client'

import { useState } from "react";
import {
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    Target,
    Zap,
    Users,
    Download,
    Plus,
    X,
    ChevronDown,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const weeklyData = [40, 65, 45, 90, 75, 120, 105, 140, 130, 160, 180, 210];
const monthlyData = [480, 650, 820, 940, 870, 1050, 1120, 980, 1200, 1350, 1480, 1620];

const revenueSources = [
    { name: "POS Sales", value: "₦850,400", share: 65, color: "bg-primary" },
    { name: "Direct Transfers", value: "₦320,000", share: 24, color: "bg-blue-500" },
    { name: "Online Store", value: "₦145,200", share: 11, color: "bg-purple-500" },
];

const pricingSimulation = [
    { category: "Electronics", current: "₦45,000", recommended: "₦47,250", change: "+5%", impact: "+₦89,500/mo" },
    { category: "Fashion", current: "₦12,500", recommended: "₦13,100", change: "+4.8%", impact: "+₦36,200/mo" },
    { category: "Accessories", current: "₦8,200", recommended: "₦8,500", change: "+3.7%", impact: "+₦18,700/mo" },
    { category: "Footwear", current: "₦22,000", recommended: "₦23,100", change: "+5%", impact: "+₦42,000/mo" },
];

export default function RevenuePage() {
    const [forecastPeriod, setForecastPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
    const [showAddSales, setShowAddSales] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);
    const [simulationApplied, setSimulationApplied] = useState(false);

    const [newSale, setNewSale] = useState({
        product: '',
        channel: 'POS',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const activeData = forecastPeriod === 'Weekly' ? weeklyData : monthlyData;
    const maxVal = Math.max(...activeData);

    const handleExport = () => {
        const rows = [
            ['Channel', 'Value', 'Share (%)'],
            ...revenueSources.map(s => [s.name, s.value, `${s.share}%`])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleAddSales = () => {
        if (!newSale.product || !newSale.amount) {
            alert("Please fill in all required fields.");
            return;
        }
        // Optimistically close the modal — in a real app this would write to Supabase
        alert(`Sales entry for "${newSale.product}" (₦${Number(newSale.amount).toLocaleString()}) added successfully!`);
        setShowAddSales(false);
        setNewSale({ product: '', channel: 'POS', amount: '', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Revenue Performance</h1>
                    <p className="text-slate-500">Monitor your sales growth and customer lifetime value.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20" onClick={() => setShowAddSales(true)}>
                        <Plus className="h-4 w-4" /> Add Sales Data
                    </Button>
                </div>
            </div>

            {/* Revenue Forecast Chart */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Revenue Forecast</CardTitle>
                            <CardDescription>Estimated revenue based on current trends</CardDescription>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-50 rounded-lg border text-xs font-bold">
                            <button
                                onClick={() => setForecastPeriod('Weekly')}
                                className={`px-3 py-1 rounded-md transition-all ${forecastPeriod === 'Weekly' ? 'bg-white shadow-sm border text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                            >Weekly</button>
                            <button
                                onClick={() => setForecastPeriod('Monthly')}
                                className={`px-3 py-1 rounded-md transition-all ${forecastPeriod === 'Monthly' ? 'bg-white shadow-sm border text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                            >Monthly</button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-8 bg-gradient-to-b from-white to-slate-50/50">
                        <div className="flex items-end justify-between h-64 gap-2 md:gap-4 p-4">
                            {activeData.map((h, i) => (
                                <div key={`${forecastPeriod}-${i}`} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${(h / maxVal) * 100}%` }}
                                        className={`w-full rounded-t-lg transition-all duration-700 ${i === activeData.length - 1 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'}`}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md transition-opacity whitespace-nowrap shadow-xl z-20 font-bold tracking-wider">
                                            {forecastPeriod === 'Weekly' ? `₦${(h * 5000).toLocaleString()}` : `₦${(h * 1000).toLocaleString()}`}
                                        </div>
                                    </div>
                                    {i % 2 === 0 && (
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {forecastPeriod === 'Weekly' ? `W${i + 1}` : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Growth Rate</h3>
                        <p className="text-2xl font-bold text-slate-900">+18.4%</p>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Avg Transaction</h3>
                        <p className="text-2xl font-bold text-slate-900">₦8,450</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Based on 142 orders</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">New Customers</h3>
                        <p className="text-2xl font-bold text-slate-900">42</p>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> 5 more than usual
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Target Achievement</h3>
                        <p className="text-2xl font-bold text-slate-900">72%</p>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-orange-500 w-[72%] rounded-full"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Top Revenue Sources</CardTitle>
                        <CardDescription>Most profitable channels and products</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {revenueSources.map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{source.name}</h4>
                                        <p className="text-xs text-slate-500">{source.share}% of total revenue</p>
                                    </div>
                                    <span className="font-bold text-sm text-slate-900">{source.value}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${source.color} rounded-full`} style={{ width: `${source.share}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <CardContent className="p-8 relative z-10 h-full flex flex-col">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Optimize Pricing with AI</h3>
                        <p className="text-white/60 mb-8 leading-relaxed max-w-sm">
                            Our AI detected that your competitor&apos;s prices for &quot;Electronics&quot; category are 5% higher. You can increase your margin without losing customers.
                        </p>
                        <div className="mt-auto">
                            <Button
                                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8"
                                onClick={() => setShowSimulation(true)}
                            >
                                Run Price Simulation
                            </Button>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
                </Card>
            </div>

            {/* ─── Add Sales Data Modal ─── */}
            {showAddSales && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Add Sales Data</CardTitle>
                                    <CardDescription>Record a new sales transaction</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddSales(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product / Service *</label>
                                <Input
                                    placeholder="e.g. Nike Sneakers x5"
                                    value={newSale.product}
                                    onChange={e => setNewSale({ ...newSale, product: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Channel</label>
                                    <div className="relative">
                                        <select
                                            value={newSale.channel}
                                            onChange={e => setNewSale({ ...newSale, channel: e.target.value })}
                                            className="w-full h-11 pl-4 pr-8 border rounded-md text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                        >
                                            <option>POS</option>
                                            <option>Direct Transfer</option>
                                            <option>Online Store</option>
                                            <option>Cash</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (₦) *</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={newSale.amount}
                                        onChange={e => setNewSale({ ...newSale, amount: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                                <Input
                                    type="date"
                                    value={newSale.date}
                                    onChange={e => setNewSale({ ...newSale, date: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowAddSales(false)}>Cancel</Button>
                                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddSales}>
                                    Save Sale
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Price Simulation Modal ─── */}
            {showSimulation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">AI Price Simulation</CardTitle>
                                        <CardDescription className="text-slate-400">Based on competitor analysis & demand data</CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={() => setShowSimulation(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="overflow-x-auto rounded-xl border border-slate-100">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-5 py-3 text-left">Category</th>
                                            <th className="px-5 py-3 text-right">Current Price</th>
                                            <th className="px-5 py-3 text-right">AI Recommended</th>
                                            <th className="px-5 py-3 text-right">Change</th>
                                            <th className="px-5 py-3 text-right">Est. Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {pricingSimulation.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-4 font-bold text-slate-900">{row.category}</td>
                                                <td className="px-5 py-4 text-right text-slate-500">{row.current}</td>
                                                <td className="px-5 py-4 text-right font-bold text-slate-900">{row.recommended}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">{row.change}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right font-bold text-primary text-xs">{row.impact}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-green-800">Total Estimated Monthly Gain: <span className="text-green-600">+₦186,400</span></p>
                                    <p className="text-xs text-green-600">Based on current sales velocity. Adjustments are gradual — no customer churn expected.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowSimulation(false)}>Dismiss</Button>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    onClick={() => { setSimulationApplied(true); setShowSimulation(false); }}
                                >
                                    Apply Recommendations
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success banner */}
            {simulationApplied && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-green-500/30 animate-in slide-in-from-bottom-4 duration-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-bold text-sm">Price recommendations applied!</span>
                    <button onClick={() => setSimulationApplied(false)} className="ml-2 opacity-70 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
