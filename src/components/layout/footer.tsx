import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";

export function Footer() {
    return (
        <footer className="bg-gray-950 text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <KudiPalLogo
                            panelClassName="px-3 shadow-sm"
                            subtitleClassName="text-gray-400"
                            showSubtitle
                            subtitle="WhatsApp-first marketplace operations"
                        />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            KudiPal connects Nigerian buyers to nearby verified vendors and service agents through chat.
                        </p>
                        <div className="flex gap-4">
                            <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                            <li><Link href="/whatsapp" className="hover:text-white">WhatsApp</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                            <li><Link href="/onboarding/business-info" className="hover:text-white">Onboarding</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Architecture</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/scale" className="hover:text-white">Scale</Link></li>
                            <li><Link href="/security" className="hover:text-white">Security</Link></li>
                            <li><Link href="/marketplace" className="hover:text-white">RAG Matching</Link></li>
                            <li><Link href="/whatsapp" className="hover:text-white">Loop Engineering</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Trust</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/security" className="hover:text-white">Security Controls</Link></li>
                            <li><Link href="/scale" className="hover:text-white">Reliability</Link></li>
                            <li><Link href="/login" className="hover:text-white">Merchant Login</Link></li>
                            <li><Link href="/test-supabase" className="hover:text-white">Supabase Test</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} KudiPal. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
