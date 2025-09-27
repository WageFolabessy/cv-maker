import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GAS Native - CV Maker",
  description: "Create your CV with ATS optimization.",
  metadataBase: new URL("https://cvmaker.efolabessy.app"),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "CV Maker",
    title: "GAS Native - CV Maker",
    description: "Create your CV with ATS optimization.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CV Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GAS Native - CV Maker",
    description: "Create your CV with ATS optimization.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/gasnative.png" />
        <meta name="theme-color" content="#2563eb" />
        <Script
          id="ld-json-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CV Maker",
              url: "https://cvmaker.efolabessy.app",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
