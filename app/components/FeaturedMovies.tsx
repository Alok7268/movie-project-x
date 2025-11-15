import Link from 'next/link';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface FeaturedMoviesProps {
  movies: Movie[];
}

export default function FeaturedMovies({ movies }: FeaturedMoviesProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Top Rated Movies</h2>
          <Link
            href="/movies"
            className="flex items-center gap-2 text-[#76030f] hover:text-[#65071e] font-semibold transition-colors duration-300 group"
          >
            View All
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

