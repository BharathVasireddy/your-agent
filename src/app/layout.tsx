import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ToasterClient from "@/components/ToasterClient";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourAgent.in - AI Agent Platform",
  description: "Your intelligent AI agent platform. Sign in to get started and unlock the power of automated assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Lazy, client-only Toaster mounted once at root */}
        <ToasterClient />
      </body>
    </html>
  );
}
