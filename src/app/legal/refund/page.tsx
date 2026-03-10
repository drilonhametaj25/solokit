import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for SoloKit — our 14-day refund policy in compliance with EU consumer protection standards.",
};

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Refund Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-invert mt-8 max-w-none">
            <h2>14-Day Refund Policy</h2>
            <p>
              {"We want you to be completely satisfied with your purchase. In accordance with EU consumer protection standards (Directive 2011/83/EU), we offer a full refund within 14 days of purchase — no questions asked."}
            </p>

            <h2>How to Request a Refund</h2>
            <p>To request a refund, simply:</p>
            <ol>
              <li>
                Email us at{" "}
                <a href="mailto:info@drilonhametaj.it">info@drilonhametaj.it</a>
              </li>
              <li>Include your order number or the email used for purchase</li>
              <li>{"Let us know which product you'd like refunded"}</li>
            </ol>

            <h2>Refund Processing</h2>
            <p>
              {"Once we receive your refund request, we'll process it within 3-5 business days. The refund will be credited to your original payment method. Depending on your bank or card issuer, it may take an additional 5-10 business days to appear on your statement."}
            </p>

            <h2>Eligibility</h2>
            <p>All purchases are eligible for a refund within 14 days, including:</p>
            <ul>
              <li>Individual templates</li>
              <li>Template bundles</li>
              <li>Any digital product sold on SoloKit</li>
            </ul>

            <h2>After 14 Days</h2>
            <p>
              {"Refund requests made after 14 days will be reviewed on a case-by-case basis. While we cannot guarantee a refund after this period, we will consider refunds for products that are defective or not as described."}
            </p>

            <h2>Exceptions</h2>
            <p>
              We reserve the right to refuse refunds in cases of suspected fraud or
              abuse of our refund policy.
            </p>

            <h2>Questions?</h2>
            <p>
              {"If you have any questions about our refund policy, please don't hesitate to contact us at "}
              <a href="mailto:info@drilonhametaj.it">info@drilonhametaj.it</a>
              {". We're here to help!"}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
