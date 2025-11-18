import type { Metadata } from "next";
import "./globals.css";
import "animate.css"; // <-- import จาก node_modules



export const metadata: Metadata = {
  title: "Selling Shirts",
  description: "An application for selling shirts.",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body >
        {children}
      </body>
    </html>
  );
}
