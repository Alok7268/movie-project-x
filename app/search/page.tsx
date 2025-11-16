import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchContent from './SearchContent';
import SparklesBackground from '../components/SparklesBackground';

export const metadata: Metadata = {
  title: "Search Movies",
  description: "Search through thousands of movies by title, actor, director, or plot. Find your favorite films quickly and easily.",
  keywords: ["movie search", "search movies", "find movies", "movie database search"],
  openGraph: {
    title: "Search Movies | Movie Directory",
    description: "Search through thousands of movies by title, actor, director, or plot. Find your favorite films quickly and easily.",
    url: "/search",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Movies | Movie Directory",
    description: "Search through thousands of movies by title, actor, director, or plot.",
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative bg-[#000000]">
        <SparklesBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#696969] mb-4"></div>
            <p className="text-gray-300">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
