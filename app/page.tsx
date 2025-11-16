import { Metadata } from 'next';
import HomeClient from './components/HomeClient';

// Export metadata for SEO (server component)
export const metadata: Metadata = {
  title: "Discover Your Next Favorite Movie",
  description: "Explore thousands of movies across multiple genres. Find top-rated films, browse by year, director, or actor. Your ultimate movie discovery platform.",
  keywords: ["movies", "film directory", "movie database", "top rated movies", "movie genres", "movie search"],
  openGraph: {
    title: "Discover Your Next Favorite Movie | Movie Directory",
    description: "Explore thousands of movies across multiple genres. Find top-rated films, browse by year, director, or actor.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Your Next Favorite Movie | Movie Directory",
    description: "Explore thousands of movies across multiple genres. Find top-rated films, browse by year, director, or actor.",
  },
};

export default function Home() {
  return <HomeClient />;
}
