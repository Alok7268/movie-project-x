'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NavigationHeader from '../components/NavigationHeader';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import SparklesBackground from '../components/SparklesBackground';
import { Movie } from '@/types/movie';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ localCount: 0, omdbCount: 0, totalCount: 0 });

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query || query.trim() === '') {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        
        if (!response.ok) {
          throw new Error('Failed to search movies');
        }

        const data = await response.json();
        setMovies(data.movies || []);
        setStats({
          localCount: data.localCount || 0,
          omdbCount: data.omdbCount || 0,
          totalCount: data.totalCount || 0,
        });
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen relative bg-[#000814]">
      {/* Sparkles Background */}
      <SparklesBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <NavigationHeader />
        
        {/* Page Header */}
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-4">
              Search Results
            </h1>
            
            {query && (
              <p className="text-gray-300 text-lg md:text-xl mb-6">
                Results for: <span className="text-[#ffc300] font-semibold">&quot;{query}&quot;</span>
              </p>
            )}

            {/* Search Stats */}
            {!loading && query && (
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 bg-[#001d3d]/60 backdrop-blur-sm rounded-lg border border-[#003566]/50">
                  <span className="text-gray-300 text-sm">Total: </span>
                  <span className="text-[#ffc300] font-bold">{stats.totalCount}</span>
                </div>
                <div className="px-4 py-2 bg-[#001d3d]/60 backdrop-blur-sm rounded-lg border border-[#003566]/50">
                  <span className="text-gray-300 text-sm">Local: </span>
                  <span className="text-white font-semibold">{stats.localCount}</span>
                </div>
                <div className="px-4 py-2 bg-[#001d3d]/60 backdrop-blur-sm rounded-lg border border-[#003566]/50">
                  <span className="text-gray-300 text-sm">OMDB: </span>
                  <span className="text-white font-semibold">{stats.omdbCount}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Search Results */}
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc300] mb-4"></div>
                  <p className="text-gray-300">Searching movies...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-[#ffc300] text-[#000814] rounded-lg font-semibold hover:bg-[#ffd60a] transition-colors duration-300"
                >
                  Go Home
                </button>
              </div>
            ) : !query || query.trim() === '' ? (
              <div className="text-center py-20">
                <p className="text-gray-300 text-lg mb-4">Please enter a search query</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-[#ffc300] text-[#000814] rounded-lg font-semibold hover:bg-[#ffd60a] transition-colors duration-300"
                >
                  Go Home
                </button>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-300 text-lg mb-4">No movies found for &quot;{query}&quot;</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-[#ffc300] text-[#000814] rounded-lg font-semibold hover:bg-[#ffd60a] transition-colors duration-300"
                >
                  Go Home
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}

