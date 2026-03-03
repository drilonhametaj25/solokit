import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Using Space Grotesk as a modern alternative to Satoshi
// To use Satoshi, download from https://www.fontshare.com/fonts/satoshi
// and configure as a local font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "SoloKit - Run Your Business Like a Pro. Alone.",
    template: "%s | SoloKit",
  },
  description:
    "Premium digital templates for freelancers and solopreneurs. Excel, Notion, and PDF templates to run your business like a pro.",
  keywords: [
    "digital templates",
    "freelancer templates",
    "business templates",
    "Excel templates",
    "Notion templates",
    "PDF templates",
    "solopreneur",
    "freelance tools",
  ],
  authors: [{ name: "SoloKit" }],
  creator: "SoloKit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SoloKit",
    title: "SoloKit - Run Your Business Like a Pro. Alone.",
    description:
      "Premium digital templates for freelancers and solopreneurs. Excel, Notion, and PDF templates to run your business like a pro.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SoloKit - Digital Templates for Freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloKit - Run Your Business Like a Pro. Alone.",
    description:
      "Premium digital templates for freelancers and solopreneurs.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
