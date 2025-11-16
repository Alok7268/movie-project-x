'use client';

import { useRouter } from 'next/navigation';
import { getAllGenres, genreToSlug } from '@/lib/movies';
import GenreGrid from '../components/GenreGrid';
import SparklesBackground from '../components/SparklesBackground';

export default function GenresPage() {
  const router = useRouter();
  const allGenres = getAllGenres();

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
        {/* Page Header */}
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#696969] to-[#7a7a7a] bg-clip-text text-transparent mb-4">
              Browse All Genres
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Explore {allGenres.length} different genres and discover your next favorite movie
            </p>
          </div>
        </section>

        {/* Genre Grid with Moving Cards */}
        <GenreGrid genres={allGenres} onGenreClick={handleGenreClick} />
      </div>
    </div>
  );
}

