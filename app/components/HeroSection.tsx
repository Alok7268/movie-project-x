'use client';

import { useState } from 'react';

interface HeroStats {
  total: number;
  genres: number;
  years: string;
}

interface HeroSectionProps {
  stats: HeroStats;
  onSearchChange?: (query: string) => void;
}

export default function HeroSection({ stats, onSearchChange }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#76030f] to-[#550b2c] bg-clip-text text-transparent tracking-tight">
          Discover Your Next Favorite Movie
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
          Explore our curated collection of {stats.total.toLocaleString()}+ movies from {stats.years}
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies, directors, actors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#76030f] focus:border-transparent transition-all duration-300"
            />
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-200"
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
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-[#231758]/40 backdrop-blur-md rounded-xl p-6 border border-[#33134a] hover:bg-[#231758]/60 transition-all duration-300 hover:scale-105">
            <div className="text-4xl font-bold text-white mb-2">{stats.total.toLocaleString()}</div>
            <div className="text-gray-200">Total Movies</div>
          </div>
          <div className="bg-[#231758]/40 backdrop-blur-md rounded-xl p-6 border border-[#33134a] hover:bg-[#231758]/60 transition-all duration-300 hover:scale-105">
            <div className="text-4xl font-bold text-white mb-2">{stats.genres}</div>
            <div className="text-gray-200">Genres</div>
          </div>
          <div className="bg-[#231758]/40 backdrop-blur-md rounded-xl p-6 border border-[#33134a] hover:bg-[#231758]/60 transition-all duration-300 hover:scale-105">
            <div className="text-4xl font-bold text-white mb-2">{stats.years}</div>
            <div className="text-gray-200">Year Range</div>
          </div>
        </div>
      </div>
    </div>
  );
}

