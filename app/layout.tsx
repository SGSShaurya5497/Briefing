import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/session-provider";
import { MainNavigation } from "@/components/main-navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FloorSwap AI — Visualize Your Dream Floor in Seconds",
    template: "%s | FloorSwap AI",
  },
  description:
    "Upload a room photo and a tile texture. Our AI realistically swaps the floor in seconds. Free, instant, no design skills needed.",
  keywords: [
    "floor visualization",
    "tile preview",
    "AI interior design",
    "floor swap",
    "room makeover",
    "tile replacement AI",
  ],
  authors: [{ name: "FloorSwap AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "FloorSwap AI — Visualize Your Dream Floor in Seconds",
    description:
      "Upload a room photo and a tile texture. Our AI realistically swaps the floor in seconds.",
    siteName: "FloorSwap AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "FloorSwap AI",
    description: "AI-powered floor texture visualization tool.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <SessionProvider session={session}>
          {children}
          <MainNavigation />
        </SessionProvider>
      </body>
    </html>
  );
}
