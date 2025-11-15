"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconSquareRoundedX, IconSearch, IconMovie } from "@tabler/icons-react";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  movies: Movie[];
  stats: {
    localCount: number;
    omdbCount: number;
    totalCount: number;
  };
  loading: boolean;
}

export default function SearchResultsModal({
  isOpen,
  onClose,
  query,
  movies,
  stats,
  loading,
}: SearchResultsModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#000814] rounded-3xl border-2 border-[#003566]/60 shadow-2xl shadow-[#ffc300]/10 overflow-hidden pointer-events-auto flex flex-col backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient background */}
              <div className="relative flex items-center justify-between p-6 border-b border-[#003566]/50 bg-gradient-to-r from-[#001d3d]/80 via-[#003566]/40 to-[#001d3d]/80 backdrop-blur-md">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffc300]/5 via-transparent to-[#ffc300]/5"></div>
                
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#ffc300]/20 to-[#ffd60a]/10 rounded-xl border border-[#ffc300]/20">
                    <IconSearch className="w-6 h-6 text-[#ffc300]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent flex items-center gap-2">
                      Search Results
                    </h2>
                    {query && (
                      <p className="text-gray-300 text-sm md:text-base mt-1.5 flex items-center gap-2">
                        <IconMovie className="w-4 h-4 text-[#ffc300]/60" />
                        Results for:{" "}
                        <span className="text-[#ffc300] font-semibold">
                          &quot;{query}&quot;
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="relative p-2.5 text-gray-400 hover:text-white hover:bg-[#001d3d]/70 rounded-xl transition-all duration-200 border border-transparent hover:border-[#003566]/50 hover:shadow-lg hover:shadow-[#ffc300]/10"
                  aria-label="Close modal"
                >
                  <IconSquareRoundedX className="w-6 h-6" />
                </button>
              </div>

              {/* Stats */}
              {!loading && query && (
                <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-[#003566]/50 bg-gradient-to-r from-[#001d3d]/40 via-[#003566]/20 to-[#001d3d]/40 backdrop-blur-sm">
                  <div className="px-5 py-2.5 bg-gradient-to-br from-[#ffc300]/20 to-[#ffd60a]/10 backdrop-blur-sm rounded-xl border border-[#ffc300]/30 shadow-lg shadow-[#ffc300]/10">
                    <div className="text-gray-300 text-xs uppercase tracking-wide mb-1">Total Results</div>
                    <span className="text-[#ffc300] font-bold text-xl">
                      {stats.totalCount}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 bg-gradient-to-br from-[#001d3d]/80 to-[#003566]/60 backdrop-blur-sm rounded-xl border border-[#003566]/50 shadow-lg">
                    <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Local Database</div>
                    <span className="text-white font-semibold text-xl">
                      {stats.localCount}
                    </span>
                  </div>
                  <div className="px-5 py-2.5 bg-gradient-to-br from-[#001d3d]/80 to-[#003566]/60 backdrop-blur-sm rounded-xl border border-[#003566]/50 shadow-lg">
                    <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">OMDB API</div>
                    <span className="text-white font-semibold text-xl">
                      {stats.omdbCount}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent via-[#000814]/20 to-transparent">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#ffc300]/30"></div>
                        <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ffc300] mb-6"></div>
                      </div>
                      <p className="text-gray-300 text-lg font-medium">Loading results...</p>
                      <p className="text-gray-500 text-sm mt-2">Please wait while we search</p>
                    </div>
                  </div>
                ) : movies.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#001d3d]/50 border-2 border-[#003566]/50 mb-6">
                      <IconSearch className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-300 text-xl font-semibold mb-2">
                      No movies found
                    </p>
                    <p className="text-gray-400 text-base mb-1">
                      No results for &quot;<span className="text-[#ffc300]">{query}</span>&quot;
                    </p>
                    <p className="text-gray-500 text-sm">
                      Try searching with different keywords or check your spelling
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

