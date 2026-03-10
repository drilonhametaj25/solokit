"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Message sent!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-card p-8"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Input
        label="Subject"
        placeholder="What is this about?"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Message"
        placeholder="Tell us more..."
        error={errors.message?.message}
        {...register("message")}
      />

      {status === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" isLoading={status === "sending"} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
