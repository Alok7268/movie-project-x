'use client';

import { useState, useMemo } from 'react';
import { Movie } from '@/types/movie';
import MovieCard3D from './MovieCard3D';
import ExpandableCard from './ui/expandable-card';

interface FeaturedMoviesProps {
  movies: Movie[];
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

type SortOption = 
  | 'rating-desc'
  | 'rating-asc'
  | 'popularity-desc'
  | 'popularity-asc'
  | 'year-desc'
  | 'year-asc'
  | 'title-asc'
  | 'title-desc'
  | 'vote-count-desc'
  | 'vote-count-asc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
  { value: 'popularity-desc', label: 'Most Popular' },
  { value: 'popularity-asc', label: 'Least Popular' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'vote-count-desc', label: 'Most Votes' },
  { value: 'vote-count-asc', label: 'Least Votes' },
];

export default function FeaturedMovies({ 
  movies, 
  title = 'Top Rated Movies',
  showViewAll = true,
  viewAllLink = '/movies'
}: FeaturedMoviesProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const sortedMovies = useMemo(() => {
    const moviesCopy = [...movies];
    
    switch (sortBy) {
      case 'rating-desc':
        return moviesCopy.sort((a, b) => b.voteAverage - a.voteAverage);
      case 'rating-asc':
        return moviesCopy.sort((a, b) => a.voteAverage - b.voteAverage);
      case 'popularity-desc':
        return moviesCopy.sort((a, b) => b.popularity - a.popularity);
      case 'popularity-asc':
        return moviesCopy.sort((a, b) => a.popularity - b.popularity);
      case 'year-desc':
        return moviesCopy.sort((a, b) => {
          const yearA = a.year ?? 0;
          const yearB = b.year ?? 0;
          return yearB - yearA;
        });
      case 'year-asc':
        return moviesCopy.sort((a, b) => {
          const yearA = a.year ?? 0;
          const yearB = b.year ?? 0;
          return yearA - yearB;
        });
      case 'title-asc':
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return moviesCopy.sort((a, b) => b.title.localeCompare(a.title));
      case 'vote-count-desc':
        return moviesCopy.sort((a, b) => b.voteCount - a.voteCount);
      case 'vote-count-asc':
        return moviesCopy.sort((a, b) => a.voteCount - b.voteCount);
      default:
        return moviesCopy;
    }
  }, [movies, sortBy]);

  const selectedOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <>
      <ExpandableCard 
        activeMovie={activeMovie} 
        onClose={() => setActiveMovie(null)} 
      />
      <section className="pt-4 pb-8 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(title || showViewAll) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-10 relative">
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#696969] bg-clip-text text-transparent text-center sm:text-left">{title}</h2>
          )}
          {showViewAll && (
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[#696969] hover:text-[#7a7a7a] font-semibold transition-colors duration-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#232323]/50 border border-[#343434]/50 hover:border-[#696969]/50 text-sm sm:text-base whitespace-nowrap min-w-[140px] sm:min-w-0"
                >
                  <span className="hidden sm:inline">{selectedOption.label}</span>
                  <span className="sm:hidden">Sort</span>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-[280px] sm:max-w-none rounded-lg bg-[#232323]/95 backdrop-blur-md border border-[#343434]/50 shadow-xl z-20 overflow-hidden">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 sm:py-2 text-sm transition-colors duration-200 ${
                              sortBy === option.value
                                ? 'bg-[#696969]/20 text-[#696969] font-semibold'
                                : 'text-gray-300 hover:bg-[#343434]/50 hover:text-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 items-stretch">
          {sortedMovies.map((movie, index) => (
            <MovieCard3D 
              key={movie.id} 
              movie={movie} 
              priority={index < 6} // Prioritize first 6 images (above the fold)
              onClick={() => setActiveMovie(movie)}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

