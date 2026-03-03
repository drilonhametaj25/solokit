import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for SoloKit - the rules and guidelines for using our products and services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-invert mt-8 max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              {"By accessing or using SoloKit's website and purchasing our products, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services."}
            </p>

            <h2>2. Products and Services</h2>
            <p>
              SoloKit sells digital template products including Excel spreadsheets,
              Notion templates, and PDF documents. All products are delivered
              digitally via email after purchase.
            </p>

            <h2>3. License and Usage Rights</h2>
            <p>Upon purchase, you receive a personal license to:</p>
            <ul>
              <li>Download and use the template for personal or business purposes</li>
              <li>Modify and customize the template for your own use</li>
              <li>Use the template for client work</li>
            </ul>
            <p>You may NOT:</p>
            <ul>
              <li>Resell, redistribute, or share the original template files</li>
              <li>Claim the template design as your own work</li>
              <li>Use the templates in a product for resale</li>
            </ul>

            <h2>4. Payment and Pricing</h2>
            <p>
              All prices are listed in USD unless otherwise specified. Payment is
              processed securely through Stripe. We accept major credit cards and
              other payment methods supported by Stripe.
            </p>

            <h2>5. Delivery</h2>
            <p>
              Digital products are delivered via email immediately after successful
              payment. Download links expire after 7 days and can be used up to 5
              times.
            </p>

            <h2>6. Refund Policy</h2>
            <p>
              {"We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us within 30 days for a full refund. See our Refund Policy for more details."}
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content, design, and intellectual property on this website belong
              to SoloKit. You may not reproduce, distribute, or create derivative
              works without our express written consent.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              {`SoloKit provides templates "as is" without warranties of any kind. We are not liable for any damages arising from the use of our products, including but not limited to direct, indirect, incidental, or consequential damages.`}
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will
              be posted on this page with an updated revision date.
            </p>

            <h2>10. Contact</h2>
            <p>
              For questions about these terms, please contact us at{" "}
              <a href="mailto:legal@solokit.co">legal@solokit.co</a>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
