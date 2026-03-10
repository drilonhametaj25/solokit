"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What file formats are included?",
    answer:
      "Our templates come in various formats depending on the product. Most include Excel (.xlsx), Google Sheets, and Notion templates. Some products also include PDF guides and resources.",
  },
  {
    question: "Can I use these templates for my clients?",
    answer:
      "Yes! You can use our templates for your own business and client work. However, you cannot resell or redistribute the templates themselves.",
  },
  {
    question: "Do I get lifetime access?",
    answer:
      "Absolutely. Once you purchase a template, it's yours forever. You'll also receive free updates to that template whenever we make improvements.",
  },
  {
    question: "What if the template doesn't work for me?",
    answer:
      "We offer a 14-day refund policy in line with EU consumer standards. If you're not satisfied with your purchase, just reach out and we'll process a full refund.",
  },
  {
    question: "Do you offer support?",
    answer:
      "Yes, we provide email support for all customers. If you have questions about using a template or need help customizing it, we're here to help.",
  },
  {
    question: "Are there any recurring fees?",
    answer:
      "No, all our templates are one-time purchases. There are no subscriptions, hidden fees, or recurring charges.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {"Got questions? We've got answers."}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-heading text-lg font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200",
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
