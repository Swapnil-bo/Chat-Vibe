import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatVibe",
  description: "AI WhatsApp Vibe Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
