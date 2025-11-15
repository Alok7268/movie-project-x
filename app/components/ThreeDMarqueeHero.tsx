"use client";

import { useState, useEffect, useCallback } from "react";
import { ThreeDMarquee } from "./ui/3d-marquee";
import { LayoutTextFlip } from "./ui/layout-text-flip";
import { motion } from "motion/react";
import { getAllMovies, getPosterUrl } from "@/lib/movies";
import { Movie } from "@/types/movie";
import { MultiStepLoader } from "./ui/multi-step-loader";
import SearchResultsModal from "./SearchResultsModal";

interface ThreeDMarqueeHeroProps {
  stats?: {
    total: number;
    genres: number;
    years: string;
  };
}

export default function ThreeDMarqueeHero({ stats }: ThreeDMarqueeHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchStats, setSearchStats] = useState({
    localCount: 0,
    omdbCount: 0,
    totalCount: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Get all movies and extract poster images
  const allMovies = getAllMovies();
  
  // Filter movies with valid poster paths and get their poster URLs
  const movieImages = allMovies
    .filter((movie: Movie) => 
      movie.posterPath && 
      movie.posterPath.trim() !== '' && 
      !movie.posterPath.includes('no-poster') &&
      !movie.posterPath.includes('placeholder')
    )
    .map((movie: Movie) => getPosterUrl(movie.posterPath, 'w500'))
    .filter((url: string) => 
      url && 
      !url.includes('no-poster') && 
      !url.includes('placeholder') &&
      (url.startsWith('http://') || url.startsWith('https://'))
    )
    .slice(0, 32); // Get 32 images for the marquee (8 per column)

  // If we don't have enough images, duplicate the array
  const images = movieImages.length >= 32 
    ? movieImages 
    : [...movieImages, ...movieImages, ...movieImages, ...movieImages].slice(0, 32);

  // Loading states for the multi-step loader
  const loadingStates = [
    { text: "Searching local database..." },
    { text: "Querying OMDB API..." },
    { text: "Matching movies..." },
    { text: "Filtering results..." },
    { text: "Preparing your results..." },
  ];

  // Handle search submission
  const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (!query) {
      return;
    }

    // Start loading - show loader first
    setIsSearching(true);
    setIsLoadingResults(true);
    
    // Record start time to ensure minimum display duration
    const startTime = Date.now();
    const minDisplayTime = 2000; // Minimum 2 seconds

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await response.json();
      setSearchResults(data.movies || []);
      setSearchStats({
        localCount: data.localCount || 0,
        omdbCount: data.omdbCount || 0,
        totalCount: data.totalCount || 0,
      });
      
      // Open modal after results are ready
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setSearchStats({ localCount: 0, omdbCount: 0, totalCount: 0 });
      setIsModalOpen(true);
    } finally {
      // Ensure loader is visible for at least minimum display time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      setTimeout(() => {
        setIsSearching(false);
        setIsLoadingResults(false);
      }, remainingTime);
    }
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      {/* Multi-step Loader */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isSearching}
        duration={1500}
        loop={true}
      />

      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        query={searchQuery.trim()}
        movies={searchResults}
        stats={searchStats}
        loading={isLoadingResults}
      />

      <div className="relative mx-auto my-10 flex min-h-[90vh] w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl px-6">
        <motion.div className="relative z-20 mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
          <LayoutTextFlip
            text="Discover Your Next "
            words={["Favorite Movie", "Cinematic Gem", "Blockbuster Hit", "Classic Film", "Award Winner"]}
            duration={3000}
          />
        </motion.div>
        <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
          Explore our curated collection of {stats?.total.toLocaleString() || 'thousands'} movies from {stats?.years || 'various years'}. 
          From timeless classics to modern masterpieces, find your perfect watch.
        </p>
        <form onSubmit={handleSearch} className="relative z-20 w-full max-w-2xl mx-auto pt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies, directors, actors..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full px-6 py-4 pl-14 pr-14 text-base md:text-lg rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc300] focus:border-[#ffc300] transition-all duration-300 shadow-lg"
            />
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>
        {/* overlay */}
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full"
          images={images}
        />
      </div>
    </>
  );
}

