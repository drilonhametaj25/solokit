import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | SoloKit",
  description:
    "Discover SoloKit — premium digital templates designed for freelancers and solopreneurs to run their business like a pro.",
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoloKit",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description:
      "Premium digital templates for freelancers and solopreneurs.",
    sameAs: [
      "https://twitter.com/solokit",
      "https://github.com/solokit",
      "https://linkedin.com/company/solokit",
    ],
  };

  return (
    <>
      <Navbar />
      <main className="py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              About SoloKit
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              We build premium digital templates that help freelancers and
              solopreneurs run their business like a pro — without the overhead
              of a full team.
            </p>
          </section>

          {/* The Problem */}
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              The Problem
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Freelancers and solopreneurs wear every hat — designer, marketer,
              accountant, project manager. Building professional systems from
              scratch takes time you don&apos;t have. Generic tools are either
              too complex or too basic. You need something that works out of the
              box, designed specifically for how you work.
            </p>
          </section>

          {/* The Solution */}
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              The Solution
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SoloKit offers ready-to-use templates for Excel, Notion, and PDF —
              built by someone who understands the solo business life. Each
              template is designed to save you hours of work so you can focus on
              what actually matters: your craft and your clients.
            </p>
          </section>

          {/* Values */}
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground text-center">
              Our Values
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  Simplicity
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No bloat, no learning curve. Templates that work from day one.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  Quality
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every template is crafted with care and tested in real
                  business scenarios.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  Independence
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Built for people who choose to work on their own terms.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Ready to work smarter?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore our templates or read the blog for free tips and
              resources.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop">
                <Button>
                  Browse Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline">Read the Blog</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
