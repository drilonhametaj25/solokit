import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | SoloKit",
  description:
    "Get in touch with SoloKit. Questions about templates, orders, or partnerships? We'd love to hear from you.",
};

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://solokit.co";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SoloKit",
    url: `${baseUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "SoloKit",
      email: "info@drilonhametaj.it",
      url: baseUrl,
    },
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
          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Have a question about our templates, an order, or a partnership
              idea? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-10 flex items-center justify-center gap-3 text-muted-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <a
              href="mailto:info@drilonhametaj.it"
              className="text-foreground transition-colors hover:text-primary"
            >
              info@drilonhametaj.it
            </a>
          </div>

          {/* Contact Form */}
          <div className="mt-10">
            <ContactForm />
          </div>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground">
                  Can I get a refund?
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Yes! We offer a 14-day refund policy on all purchases. See our{" "}
                  <Link
                    href="/legal/refund"
                    className="text-primary hover:underline"
                  >
                    Refund Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  How do I download my purchase?
                </h3>
                <p className="mt-1 text-muted-foreground">
                  After purchase, you&apos;ll receive an email with a download
                  link. The link is valid for 7 days and up to 5 downloads.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Can I use templates for client work?
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Yes! Your license allows personal and client use. See our{" "}
                  <Link
                    href="/legal/terms"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  for the full license details.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
