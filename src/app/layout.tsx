import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Chotta Mumbai Vibe - Just Chill",
    template: "%s | Chotta Mumbai Vibe"
  },
  description: "Experience the vibrant energy of Mumbai with our interactive music app. Just chill and enjoy the vibe!",
  keywords: ["Mumbai", "music", "interactive", "entertainment", "chill", "vibe"],
  authors: [{ name: "Varun Narayanan", url: "https://www.varunnarayananwrites.site" }],
  creator: "Varun Narayanan",
  publisher: "Varun Narayanan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  alternates: {
    canonical: "https://vibe.varunnarayananwrites.site"
  },
  openGraph: {
    title: "Chotta Mumbai Vibe - Just Chill",
    description: "Experience the vibrant energy of Mumbai with our interactive music app. Just chill and enjoy the vibe!",
    url: "https://vibe.varunnarayananwrites.site",
    siteName: "Chotta Mumbai Vibe",
    images: [
      {
        url: "https://vibe.varunnarayananwrites.site/og-image",
        width: 1200,
        height: 630,
        alt: "Chotta Mumbai Vibe"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chotta Mumbai Vibe - Just Chill",
    description: "Experience the vibrant energy of Mumbai with our interactive music app. Just chill and enjoy the vibe!",
    creator: "@Varun_Narayana1",
    images: ["https://vibe.varunnarayananwrites.site/og-image"],
  },
  verification: {
    google: "LJsRh8GenJ6oEHdN09UFb5PzBt7qKwOoVoceElfzBkA", // Add your Google Search Console verification code
  },
}; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
