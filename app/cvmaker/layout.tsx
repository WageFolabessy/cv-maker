import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Maker — Editor",
  description: "Edit and export your CV with ATS optimization.",
  alternates: { canonical: "/cvmaker" },
  openGraph: {
    type: "website",
    url: "/cvmaker",
    title: "CV Maker — Editor",
    description: "Edit and export your CV with ATS optimization.",
    images: [
      {
        url: "/images/gasnative.webp",
        width: 1200,
        height: 630,
        alt: "CV Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Maker — Editor",
    description: "Edit and export your CV with ATS optimization.",
    images: ["/images/gasnative.webp"],
  },
};

export default function CVMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
