"use client";

import * as React from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox for a welcome email.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <h2 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Get Free Templates & Tips
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our newsletter for exclusive templates, productivity tips,
              and early access to new products.
            </p>

            {/* Form */}
            {status === "success" ? (
              <div className="mt-8 flex items-center justify-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  disabled={status === "loading"}
                />
                <Button type="submit" isLoading={status === "loading"}>
                  Subscribe
                </Button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-2 text-sm text-destructive">{message}</p>
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
