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
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent tracking-tight drop-shadow-2xl">
          Discover Your Next Favorite Movie
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
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
              className="w-full px-6 py-4 text-lg rounded-2xl bg-[#001d3d]/60 backdrop-blur-md border border-[#003566]/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc300] focus:border-[#ffc300] transition-all duration-300 shadow-lg shadow-[#003566]/20"
            />
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-hover:text-[#ffc300] transition-colors duration-300"
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
          <div className="bg-gradient-to-br from-[#001d3d]/80 to-[#000814]/80 backdrop-blur-md rounded-xl p-6 border border-[#003566]/50 hover:border-[#ffc300]/50 hover:bg-gradient-to-br hover:from-[#001d3d] hover:to-[#000814] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ffc300]/20">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-2">{stats.total.toLocaleString()}</div>
            <div className="text-gray-300">Total Movies</div>
          </div>
          <div className="bg-gradient-to-br from-[#001d3d]/80 to-[#000814]/80 backdrop-blur-md rounded-xl p-6 border border-[#003566]/50 hover:border-[#ffc300]/50 hover:bg-gradient-to-br hover:from-[#001d3d] hover:to-[#000814] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ffc300]/20">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-2">{stats.genres}</div>
            <div className="text-gray-300">Genres</div>
          </div>
          <div className="bg-gradient-to-br from-[#001d3d]/80 to-[#000814]/80 backdrop-blur-md rounded-xl p-6 border border-[#003566]/50 hover:border-[#ffc300]/50 hover:bg-gradient-to-br hover:from-[#001d3d] hover:to-[#000814] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ffc300]/20">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-2">{stats.years}</div>
            <div className="text-gray-300">Year Range</div>
          </div>
        </div>
      </div>
    </div>
  );
}

