'use client';

import { useRouter } from 'next/navigation';
import { getAllMovies, getAllGenres, getTopRated, getYearRange, genreToSlug } from '@/lib/movies';
import ThreeDMarqueeHero from './ThreeDMarqueeHero';
import FeaturedMovies from './FeaturedMovies';
import GenreGrid from './GenreGrid';
import SparklesBackground from './SparklesBackground';

export default function HomeClient() {
  const router = useRouter();
  
  // Get data
  const allMovies = getAllMovies();
  const allGenres = getAllGenres();
  const topMovies = getTopRated(18);
  const yearRange = getYearRange();

  // Calculate stats
  const stats = {
    total: allMovies.length,
    genres: allGenres.length,
    years: yearRange,
  };

  // Handle genre click - navigate to genre page
  const handleGenreClick = (genre: string) => {
    const slug = genreToSlug(genre);
    router.push(`/${slug}`);
  };

  return (
    <div className="min-h-screen relative bg-[#000000]">
      {/* Sparkles Background */}
      <SparklesBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <ThreeDMarqueeHero stats={stats} />
        <FeaturedMovies movies={topMovies} />
        <GenreGrid genres={allGenres} onGenreClick={handleGenreClick} />
      </div>
    </div>
  );
}

