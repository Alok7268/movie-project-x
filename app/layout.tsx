import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationHeader from "./components/NavigationHeader";
import Footer from "./components/Footer";

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
    default: "Movie Directory - Discover Your Next Favorite Movie",
    template: "%s | Movie Directory",
  },
  description: "Explore our curated collection of movies. Browse by genre, year, and rating. Find the best movies by director, actor, or decade. Powered by TMDB Dataset.",
  keywords: ["movies", "film directory", "movie database", "movie search", "genres", "movie ratings", "TMDB", "movie recommendations"],
  authors: [{ name: "Movie Directory" }],
  creator: "Movie Directory",
  publisher: "Movie Directory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Movie Directory",
    title: "Movie Directory - Discover Your Next Favorite Movie",
    description: "Explore our curated collection of movies. Browse by genre, year, and rating. Find the best movies by director, actor, or decade.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Movie Directory - Discover Your Next Favorite Movie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Directory - Discover Your Next Favorite Movie",
    description: "Explore our curated collection of movies. Browse by genre, year, and rating.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NavigationHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
