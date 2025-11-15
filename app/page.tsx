'use client';

import { useRouter } from 'next/navigation';
import { getAllMovies, getAllGenres, getTopRated, getYearRange, genreToSlug } from '@/lib/movies';
import ThreeDMarqueeHero from './components/ThreeDMarqueeHero';
import FeaturedMovies from './components/FeaturedMovies';
import GenreGrid from './components/GenreGrid';
import NavigationHeader from './components/NavigationHeader';
import Footer from './components/Footer';
import SparklesBackground from './components/SparklesBackground';

export default function Home() {
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
    <div className="min-h-screen relative bg-[#000814]">
      {/* Sparkles Background */}
      <SparklesBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <NavigationHeader />
        <ThreeDMarqueeHero stats={stats} />
        <FeaturedMovies movies={topMovies} />
        <GenreGrid genres={allGenres} onGenreClick={handleGenreClick} />
        <Footer />
      </div>
    </div>
  );
}
