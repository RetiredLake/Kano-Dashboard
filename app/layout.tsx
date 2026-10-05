import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegistration from "./pwa-registration";

export const metadata: Metadata = {
  title: "Kano Dashboard",
  description: "Open Story Mode, Kano Code, or Make Art.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Kano Dashboard", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/dashboard/pwa-192.png",
  },
};

export const viewport: Viewport = { themeColor: "#77c7e9" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><PwaRegistration />{children}</body>
    </html>
  );
}
