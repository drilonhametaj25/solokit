import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for SoloKit - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-invert mt-8 max-w-none">
            <h2>1. Introduction</h2>
            <p>
              {`SoloKit ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.`}
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>
                <strong>Contact Information:</strong> Email address and name when you
                make a purchase or subscribe to our newsletter.
              </li>
              <li>
                <strong>Payment Information:</strong> Payment details are processed
                securely by Stripe. We do not store your full credit card information.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with
                our website, including pages visited and actions taken.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process your orders and deliver purchased products</li>
              <li>Send order confirmations and download links</li>
              <li>{"Send marketing communications (if you've opted in)"}</li>
              <li>Improve our website and products</li>
              <li>Respond to your inquiries and provide customer support</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information with:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Such as Stripe (payments), Resend
                (email), and Supabase (data storage) to operate our business.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect
                our rights.
              </li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal
              information. However, no method of transmission over the Internet is
              100% secure.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use essential cookies to ensure our website functions properly. We
              may also use analytics cookies to understand how visitors use our site.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:privacy@solokit.co">privacy@solokit.co</a>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
