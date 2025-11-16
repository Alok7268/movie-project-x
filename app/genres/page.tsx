import { Metadata } from 'next';
import GenresClient from './GenresClient';

export const metadata: Metadata = {
  title: "Browse All Genres",
  description: "Explore movies across all genres. From action to drama, comedy to horror, discover your favorite movie genres and find new favorites.",
  keywords: ["movie genres", "genres", "browse genres", "movie categories", "film genres"],
  openGraph: {
    title: "Browse All Genres | Movie Directory",
    description: "Explore movies across all genres. From action to drama, comedy to horror, discover your favorite movie genres.",
    url: "/genres",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Genres | Movie Directory",
    description: "Explore movies across all genres. From action to drama, comedy to horror.",
  },
};

export default function GenresPage() {
  return <GenresClient />;
}
