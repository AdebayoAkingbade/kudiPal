import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  DatabaseZap,
  LocateFixed,
  LockKeyhole,
  MessagesSquare,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RequestMatchDemo } from "@/features/marketplace/request-match-demo";
import { Button } from "@/components/ui/button";

const routeCards = [
  {
    href: "/marketplace",
    title: "Marketplace",
    detail: "Buyer request parsing, RAG retrieval, and local vendor matching.",
    icon: DatabaseZap,
  },
  {
    href: "/whatsapp",
    title: "WhatsApp",
    detail: "Buyer, seller, payment, reminder, and fulfillment loops in chat.",
    icon: MessagesSquare,
  },
  {
    href: "/security",
    title: "Security",
    detail: "Defense-in-depth controls for webhooks, payments, data, and abuse.",
    icon: LockKeyhole,
  },
  {
    href: "/scale",
    title: "Scale",
    detail: "Architecture boundaries for queues, geo search, evals, and reliability.",
    icon: Network,
  },
];

const priorities = [
  { label: "NLP", value: "Product, service, and errand intents", icon: Bot },
  { label: "Geo", value: "WhatsApp pin and seller coverage ranking", icon: LocateFixed },
  { label: "Trust", value: "Verified sellers, audit logs, and payment safety", icon: ShieldCheck },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.02fr_0.98fr] md:py-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-primary">KudiPal App Router Frontend</p>
            <h1 className="mt-3 font-heading text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              WhatsApp marketplace copilot for nearby vendors and service agents.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              KudiPal turns everyday WhatsApp requests into structured intent, local retrieval, seller ranking,
              payment-safe conversations, and learning loops.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/marketplace">
                  Open Matching Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/whatsapp">View WhatsApp Flow</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {priorities.map((priority) => (
                <div key={priority.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <priority.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-bold text-slate-950">{priority.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{priority.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-slate-400">/src/app/(public)/page.tsx</p>
              </div>
              <div className="grid gap-4 p-4">
                <Image
                  src="/images/hero-dashboard.png"
                  alt="KudiPal dashboard preview"
                  width={640}
                  height={640}
                  priority
                  className="aspect-[16/10] w-full rounded-md object-cover"
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  {["WhatsApp", "RAG", "Payments"].map((item) => (
                    <div key={item} className="rounded-lg bg-white/10 p-3 text-white">
                      <p className="text-xs font-semibold uppercase text-emerald-200">{item}</p>
                      <div className="mt-3 h-2 rounded-full bg-white/15">
                        <div className="h-2 w-3/4 rounded-full bg-emerald-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestMatchDemo />

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-primary">Folder-based routes</p>
              <h2 className="font-heading text-3xl font-black text-slate-950">Source you can maintain</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Each card below maps directly to a folder under src/app. The .next folder is generated output.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {routeCards.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group rounded-lg border border-slate-200 p-4 transition hover:border-primary/50 hover:bg-emerald-50/40"
              >
                <route.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-heading text-lg font-bold text-slate-950">{route.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{route.detail}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Open route
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
