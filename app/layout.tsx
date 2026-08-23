import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast/toast-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const SITE_URL = "https://internet-toolbox.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Internet Toolbox \u2013 Free online tools for developers",
    template: "%s \u2013 Internet Toolbox",
  },
  description:
    "Internet Toolbox is a fast, modern, privacy-first collection of free online tools for developers and everyone: JSON, encoding, text, date, network, generators and more.",
  openGraph: {
    title: "Internet Toolbox",
    description: "Free online tools for developers and everyone. Fast, private, client-side.",
    url: SITE_URL,
    siteName: "Internet Toolbox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet Toolbox",
    description: "Free online tools for developers and everyone.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
