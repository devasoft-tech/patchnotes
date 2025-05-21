import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Best Tech Newsletters | PatchNotes - Developer Newsletter Discovery Platform",
    template: "%s | PatchNotes - Tech Newsletter Discovery"
  },
  description: "Discover the best tech newsletters and developer email digests. Curated collection of top software engineering newsletters, programming updates, and tech news for developers.",
  keywords: [
    "best tech newsletters",
    "top developer newsletters",
    "software engineering newsletters",
    "tech email digests",
    "curated newsletters for developers",
    "programming newsletters",
    "developer resources",
    "tech news",
    "software development updates",
    "coding newsletters"
  ],
  authors: [{ name: "PatchNotes" }],
  creator: "PatchNotes",
  publisher: "PatchNotes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://patchnotes.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Best Tech Newsletters | PatchNotes - Developer Newsletter Discovery Platform',
    description: 'Find and subscribe to the best curated tech newsletters and developer email digests. Stay updated with top software engineering newsletters.',
    url: 'https://patchnotes.dev',
    siteName: 'PatchNotes',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PatchNotes - Discover the Best Tech Newsletters'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Tech Newsletters | PatchNotes',
    description: 'Find and subscribe to the best curated tech newsletters and developer email digests.',
    creator: '@patchnotes',
    images: ['/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        
        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PatchNotes",
              description: "Discover the best tech newsletters and developer email digests. Curated collection of top software engineering newsletters.",
              url: "https://patchnotes.dev",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://patchnotes.dev/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider>
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
} 