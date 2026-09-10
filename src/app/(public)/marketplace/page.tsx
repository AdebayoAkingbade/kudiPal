import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, MapPin, MessageSquareText, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RequestMatchDemo } from "@/features/marketplace/request-match-demo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "KudiPal buyer request matching, vendor ranking, and WhatsApp marketplace workflow.",
};

const capabilities = [
  {
    title: "Buyer intent extraction",
    detail: "Classifies product, service, and errand requests from informal WhatsApp text.",
    icon: MessageSquareText,
  },
  {
    title: "Nearby ranking",
    detail: "Ranks vendors and agents by distance, availability, price, reputation, and response speed.",
    icon: MapPin,
  },
  {
    title: "RAG marketplace memory",
    detail: "Retrieves inventory, seller policies, service coverage, reviews, and prior fulfillment outcomes.",
    icon: Database,
  },
  {
    title: "Trust gate",
    detail: "Keeps payments, identity, audit trails, moderation, and seller acceptance inside controlled loops.",
    icon: ShieldCheck,
  },
];

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-primary">Marketplace route</p>
            <h1 className="mt-2 font-heading text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              WhatsApp requests become local vendor matches.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              This route is the maintainable frontend home for the buyer matching workflow.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/whatsapp">
                  View WhatsApp Flow
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/security">Security Posture</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <RequestMatchDemo />
      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <article key={capability.title} className="rounded-lg border border-slate-200 p-4">
              <capability.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-heading text-lg font-bold text-slate-950">{capability.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{capability.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
