import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  BrainCircuit,
  DatabaseZap,
  Globe2,
  Layers3,
  MessagesSquare,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scale",
  description: "KudiPal scale architecture for WhatsApp, RAG, ranking, payments, and trust at very large user counts.",
};

const layers = [
  { title: "Edge and ingress", detail: "WAF, DDoS protection, request shaping, webhook queues, and regional failover.", icon: Globe2 },
  { title: "Conversation platform", detail: "Partitioned WhatsApp sessions, idempotent events, reminders, and state machines.", icon: MessagesSquare },
  { title: "Retrieval layer", detail: "Vendor catalog, service coverage, review memory, embeddings, full-text search, and geospatial indexes.", icon: DatabaseZap },
  { title: "AI harness", detail: "Golden datasets, regression evals, prompt versioning, red-team prompts, and offline replay.", icon: BrainCircuit },
  { title: "Marketplace services", detail: "Matching, seller acceptance, payment, fulfillment, disputes, and trust scoring as separate domains.", icon: Boxes },
  { title: "Reliability", detail: "Queues, circuit breakers, backpressure, multi-region databases, cache tiers, and observability.", icon: Network },
  { title: "Security operations", detail: "Secrets management, key rotation, SIEM, audit trails, anomaly detection, and least privilege.", icon: ShieldCheck },
  { title: "Data products", detail: "Feature store, outcome feedback, analytics warehouse, model monitoring, and privacy governance.", icon: Layers3 },
];

export default function ScalePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <p className="text-sm font-bold uppercase text-primary">Scale route</p>
          <h1 className="mt-2 max-w-4xl font-heading text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Build the billion-user version as a set of controlled loops.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            The app can start simple, but the boundaries should already prepare for queues, geospatial retrieval,
            evaluations, regional isolation, and trust systems.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/marketplace">Open Matching Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/security">Security Plan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
          {layers.map((layer) => (
            <article key={layer.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <layer.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-heading text-lg font-bold text-slate-950">{layer.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{layer.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
