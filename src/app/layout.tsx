import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/utils/config";
import Providers from "@/providers/Providers";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import Loading from "./loading";

const { SITE_NAME, SITE_DESCRIPTION } = config;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // metadataBase: new URL(SITE_URL),
  keywords: [],
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
        <Toaster position="top-right" richColors expand={true} closeButton />
      </body>
    </html>
  );
}
