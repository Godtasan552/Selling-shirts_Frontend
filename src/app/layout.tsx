import type { Metadata, Viewport } from "next";
import "./globals.css";
import "animate.css";

export const metadata: Metadata = {
  title: "Selling Shirts",
  description: "An application for selling shirts.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Selling Shirts",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: "/shirt_color.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        {children}
      </body>
    </html>
  );
}