import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Purchase Complete",
  description: "Thank you for your purchase. Check your email for download instructions.",
  robots: {
    index: false,
    follow: false,
  },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  // Await searchParams for Next.js 15 compatibility
  await searchParams;

  return (
    <>
      <Navbar />
      <main className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center sm:p-12">
            {/* Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>

            {/* Title */}
            <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
              Thank You for Your Purchase!
            </h1>

            {/* Description */}
            <p className="mt-4 text-lg text-muted-foreground">
              Your order has been confirmed and your download link is on its way.
            </p>

            {/* Email Notice */}
            <div className="mt-8 rounded-xl bg-card border border-border p-6">
              <div className="flex items-center justify-center gap-3 text-primary">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Check your email</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {"We've sent a confirmation email with your download link. The link will expire in 7 days and can be used up to 5 times."}
              </p>
            </div>

            {/* What's Next */}
            <div className="mt-8 space-y-4 text-left">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                What happens next?
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    1
                  </span>
                  <span>
                    Check your inbox (and spam folder) for an email from SoloKit
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    2
                  </span>
                  <span>
                    Click the download link to get your template files
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    3
                  </span>
                  <span>
                    Customize the template and start running your business like a pro!
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/shop">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Support */}
            <p className="mt-8 text-sm text-muted-foreground">
              Having trouble? Contact us at{" "}
              <a
                href="mailto:support@solokit.co"
                className="text-primary hover:underline"
              >
                support@solokit.co
              </a>
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
