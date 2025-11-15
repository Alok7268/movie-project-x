import Link from 'next/link';
import { Movie } from '@/types/movie';
import MovieCard3D from './MovieCard3D';

interface FeaturedMoviesProps {
  movies: Movie[];
}

export default function FeaturedMovies({ movies }: FeaturedMoviesProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-10 relative">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#ffc300] bg-clip-text text-transparent">Top Rated Movies</h2>
          <Link
            href="/movies"
            className="absolute right-0 flex items-center gap-2 text-[#ffc300] hover:text-[#ffd60a] font-semibold transition-colors duration-300 group px-4 py-2 rounded-lg hover:bg-[#001d3d]/50 border border-[#003566]/50 hover:border-[#ffc300]/50"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 items-stretch">
          {movies.map((movie, index) => (
            <MovieCard3D 
              key={movie.id} 
              movie={movie} 
              priority={index < 6} // Prioritize first 6 images (above the fold)
            />
          ))}
        </div>
      </div>
    </section>
  );
}

