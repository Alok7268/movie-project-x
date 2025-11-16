import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { filterMovies, findGenreBySlug, MovieFilterOptions, getPopularGenres, getPopularActors, getPopularDirectors } from '@/lib/movies';
import FeaturedMovies from '../components/FeaturedMovies';
import SparklesBackground from '../components/SparklesBackground';
import PermutationButtons from '../components/PermutationButtons';

interface MoviesPageProps {
  searchParams: Promise<{
    genre?: string | string[];
    actor?: string | string[];
    director?: string | string[];
    year?: string | string[];
    decade?: string | string[];
    minRating?: string;
    minVoteCount?: string;
  }>;
}

// Helper function to generate page title from filters
function generatePageTitle(filters: MovieFilterOptions): string {
  const parts: string[] = [];
  
  // Add genres
  if (filters.genres && filters.genres.length > 0) {
    if (filters.genres.length === 1) {
      parts.push(filters.genres[0]);
    } else {
      // Format multiple genres: "Action & Thriller"
      const genreList = filters.genres.slice(0, -1).join(', ') + ' & ' + filters.genres[filters.genres.length - 1];
      parts.push(genreList);
    }
  }
  
  // Add actors
  if (filters.actors && filters.actors.length > 0) {
    if (filters.actors.length === 1) {
      parts.push(`featuring ${filters.actors[0]}`);
    } else {
      const actorList = filters.actors.slice(0, -1).join(', ') + ' & ' + filters.actors[filters.actors.length - 1];
      parts.push(`featuring ${actorList}`);
    }
  }
  
  // Add directors
  if (filters.directors && filters.directors.length > 0) {
    if (filters.directors.length === 1) {
      parts.push(`by ${filters.directors[0]}`);
    } else {
      const directorList = filters.directors.slice(0, -1).join(', ') + ' & ' + filters.directors[filters.directors.length - 1];
      parts.push(`by ${directorList}`);
    }
  }
  
  // Add years
  if (filters.years && filters.years.length > 0) {
    if (filters.years.length === 1) {
      parts.push(`from ${filters.years[0]}`);
    } else {
      parts.push(`from ${filters.years.join(', ')}`);
    }
  }
  
  // Add decades
  if (filters.decades && filters.decades.length > 0) {
    if (filters.decades.length === 1) {
      parts.push(`from the ${filters.decades[0]}s`);
    } else {
      const decadeList = filters.decades.map(d => `${d}s`).join(', ');
      parts.push(`from the ${decadeList}`);
    }
  }
  
  // Build the title
  let title = 'Best';
  
  if (parts.length === 0) {
    title = 'Best Movies';
  } else {
    // Capitalize first letter of each part
    const capitalizedParts = parts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    );
    
    if (filters.genres && filters.genres.length > 0) {
      title = `Best ${capitalizedParts.join(' ')} Movies`;
    } else if (filters.actors && filters.actors.length > 0) {
      title = `Best Movies ${capitalizedParts.join(' ')}`;
    } else if (filters.directors && filters.directors.length > 0) {
      title = `Best Movies ${capitalizedParts.join(' ')}`;
    } else {
      title = `Best Movies ${capitalizedParts.join(' ')}`;
    }
  }
  
  return title;
}

// Helper function to parse search params into filter options
function parseSearchParams(searchParams: Awaited<MoviesPageProps['searchParams']>): MovieFilterOptions {
  const filters: MovieFilterOptions = {};
  
  // Parse genres
  if (searchParams.genre) {
    const genreArray = Array.isArray(searchParams.genre) ? searchParams.genre : [searchParams.genre];
    filters.genres = genreArray.map(g => {
      // Try to find genre by slug first
      const foundGenre = findGenreBySlug(decodeURIComponent(g));
      return foundGenre || decodeURIComponent(g);
    });
  }
  
  // Parse actors
  if (searchParams.actor) {
    const actorArray = Array.isArray(searchParams.actor) ? searchParams.actor : [searchParams.actor];
    filters.actors = actorArray.map(a => decodeURIComponent(a));
  }
  
  // Parse directors
  if (searchParams.director) {
    const directorArray = Array.isArray(searchParams.director) ? searchParams.director : [searchParams.director];
    filters.directors = directorArray.map(d => decodeURIComponent(d));
  }
  
  // Parse years
  if (searchParams.year) {
    const yearArray = Array.isArray(searchParams.year) ? searchParams.year : [searchParams.year];
    filters.years = yearArray.map(y => parseInt(y)).filter(y => !isNaN(y));
  }
  
  // Parse decades
  if (searchParams.decade) {
    const decadeArray = Array.isArray(searchParams.decade) ? searchParams.decade : [searchParams.decade];
    filters.decades = decadeArray.map(d => parseInt(d)).filter(d => !isNaN(d));
  }
  
  // Parse minRating
  if (searchParams.minRating) {
    const rating = parseFloat(searchParams.minRating);
    if (!isNaN(rating)) {
      filters.minRating = rating;
    }
  }
  
  // Parse minVoteCount
  if (searchParams.minVoteCount) {
    const voteCount = parseInt(searchParams.minVoteCount);
    if (!isNaN(voteCount)) {
      filters.minVoteCount = voteCount;
    }
  }
  
  return filters;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  
  // Parse search params into filter options
  const filters = parseSearchParams(params);
  
  // Get data for permutation buttons (using popular items based on actual data)
  const popularGenres = getPopularGenres(10);
  const popularActors = getPopularActors(10);
  const popularDirectors = getPopularDirectors(10);
  
  // If no filters provided, show all movies sorted by rating
  if (Object.keys(filters).length === 0) {
    const allMovies = filterMovies({});
    const sortedMovies = [...allMovies].sort((a, b) => b.voteAverage - a.voteAverage);
    
    return (
      <div className="min-h-screen relative bg-[#000000]">
        <SparklesBackground />
        <div className="relative z-10">
          <section className="pt-32 pb-8 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#696969] to-[#7a7a7a] bg-clip-text text-transparent mb-4">
                Best Movies
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">
                Discover {sortedMovies.length} amazing movies
              </p>
            </div>
          </section>
          
          {/* Permutation Buttons */}
          <PermutationButtons 
            genres={popularGenres}
            popularActors={popularActors}
            popularDirectors={popularDirectors}
          />
          
          <FeaturedMovies 
            movies={sortedMovies} 
            title=""
            showViewAll={false}
          />
        </div>
      </div>
    );
  }
  
  // Filter movies based on criteria
  const filteredMovies = filterMovies(filters);
  
  // Sort by rating (best first)
  const sortedMovies = [...filteredMovies].sort((a, b) => b.voteAverage - a.voteAverage);
  
  // If no movies found, show 404
  if (sortedMovies.length === 0) {
    notFound();
  }
  
  // Generate page title
  const pageTitle = generatePageTitle(filters);
  
  return (
    <div className="min-h-screen relative bg-[#000000]">
      <SparklesBackground />
      <div className="relative z-10">
        {/* Page Header Section */}
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#696969] to-[#7a7a7a] bg-clip-text text-transparent mb-4">
              {pageTitle}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Discover {sortedMovies.length} amazing {sortedMovies.length === 1 ? 'movie' : 'movies'}
            </p>
          </div>
        </section>

        {/* Permutation Buttons */}
        <PermutationButtons 
          genres={popularGenres}
          popularActors={popularActors}
          popularDirectors={popularDirectors}
        />

        {/* Movies Grid */}
        <FeaturedMovies 
          movies={sortedMovies} 
          title=""
          showViewAll={false}
        />
      </div>
    </div>
  );
}

