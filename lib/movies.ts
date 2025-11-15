import moviesData from '@/public/data/movies.json';
import { Movie } from '@/types/movie';

const movies = moviesData as Movie[];

// TMDB image base URL
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getPosterUrl(posterPath: string | null, size: 'w200' | 'w500' | 'original' = 'w500') {
  if (!posterPath || posterPath.trim() === '') {
    // Use local SVG placeholder
    return '/no-poster.svg';
  }
  
  // If posterPath is already a full URL (from OMDb or other sources), return it as-is
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) {
    return posterPath;
  }
  
  // Otherwise, treat it as a TMDB path and construct the URL
  const normalizedPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`;
  return `${TMDB_IMAGE_BASE}/${size}${normalizedPath}`;
}

export function getBackdropUrl(backdropPath: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!backdropPath || backdropPath.trim() === '') {
    // Use local SVG placeholder
    return '/no-backdrop.svg';
  }
  
  // If backdropPath is already a full URL (from OMDb or other sources), return it as-is
  if (backdropPath.startsWith('http://') || backdropPath.startsWith('https://')) {
    return backdropPath;
  }
  
  // Otherwise, treat it as a TMDB path and construct the URL
  const normalizedPath = backdropPath.startsWith('/') ? backdropPath : `/${backdropPath}`;
  return `${TMDB_IMAGE_BASE}/${size}${normalizedPath}`;
}

export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieById(id: number): Movie | undefined {
  return movies.find(m => m.id === id);
}

export function getMoviesByGenre(genre: string): Movie[] {
  return movies.filter(m => m.genres.includes(genre));
}

export function getMoviesByYear(year: number): Movie[] {
  return movies.filter(m => m.year === year);
}

export function getMoviesByDecade(decade: number): Movie[] {
  return movies.filter(m => m.decade === decade);
}

export function getAllGenres(): string[] {
  const genreSet = new Set<string>();
  movies.forEach(m => m.genres.forEach(g => genreSet.add(g)));
  return Array.from(genreSet).sort();
}

export function getYearRange(): string {
  const years = movies
    .map(m => m.year)
    .filter((year): year is number => year !== null);
  
  if (years.length === 0) return 'N/A';
  
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  return minYear === maxYear ? `${minYear}` : `${minYear}-${maxYear}`;
}

export function getTopRated(limit: number = 10): Movie[] {
  return [...movies]
    .sort((a, b) => b.voteAverage - a.voteAverage)
    .slice(0, limit);
}

export function searchMovies(query: string): Movie[] {
  const lowerQuery = query.toLowerCase();
  return movies.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.overview.toLowerCase().includes(lowerQuery) ||
    m.director?.toLowerCase().includes(lowerQuery) ||
    m.cast.some(c => c.name.toLowerCase().includes(lowerQuery))
  );
}

// Simple hash function to generate consistent index for each genre
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Cache to track which movie IDs have been used for genre images
// This ensures each genre gets a unique movie
const usedMovieIds = new Set<number>();

export function getGenreImage(genre: string): string {
  // Get all movies in this genre, sorted by popularity and rating
  const allGenreMovies = getMoviesByGenre(genre).sort((a, b) => {
    // Sort by vote average first, then by popularity
    if (b.voteAverage !== a.voteAverage) {
      return b.voteAverage - a.voteAverage;
    }
    return b.popularity - a.popularity;
  });

  if (allGenreMovies.length === 0) {
    // Return placeholder if no movies in genre
    return '/no-poster.svg';
  }

  // Use hash of genre name to select a consistent but unique movie index for each genre
  // This ensures each genre gets a different starting point
  const genreHash = hashString(genre);
  const startIndex = genreHash % allGenreMovies.length;
  
  // Create a rotated list starting from the hashed index
  const moviesToCheck = [
    ...allGenreMovies.slice(startIndex),
    ...allGenreMovies.slice(0, startIndex)
  ];

  // First, try to find a movie with a valid poster that hasn't been used yet
  for (const movie of moviesToCheck) {
    // Skip if this movie ID has already been used for another genre
    if (usedMovieIds.has(movie.id)) {
      continue;
    }

    if (movie.posterPath && 
        movie.posterPath.trim() !== '' && 
        !movie.posterPath.includes('no-poster') &&
        !movie.posterPath.includes('placeholder')) {
      const posterUrl = getPosterUrl(movie.posterPath, 'w500');
      // Make sure it's not a placeholder and is a valid URL
      if (posterUrl && 
          !posterUrl.includes('no-poster') && 
          !posterUrl.includes('placeholder') &&
          (posterUrl.startsWith('http://') || posterUrl.startsWith('https://'))) {
        // Mark this movie as used
        usedMovieIds.add(movie.id);
        return posterUrl;
      }
    }
  }

  // If no unused poster found, try backdrops
  for (const movie of moviesToCheck) {
    // Skip if this movie ID has already been used
    if (usedMovieIds.has(movie.id)) {
      continue;
    }

    if (movie.backdropPath && 
        movie.backdropPath.trim() !== '' && 
        !movie.backdropPath.includes('no-backdrop') &&
        !movie.backdropPath.includes('placeholder')) {
      const backdropUrl = getBackdropUrl(movie.backdropPath, 'w780');
      // Make sure it's not a placeholder and is a valid URL
      if (backdropUrl && 
          !backdropUrl.includes('no-backdrop') && 
          !backdropUrl.includes('placeholder') &&
          (backdropUrl.startsWith('http://') || backdropUrl.startsWith('https://'))) {
        // Mark this movie as used
        usedMovieIds.add(movie.id);
        return backdropUrl;
      }
    }
  }

  // If still no image found, allow reuse but try to get a different one
  // Reset and try again without the uniqueness constraint
  for (const movie of moviesToCheck) {
    if (movie.posterPath && 
        movie.posterPath.trim() !== '' && 
        !movie.posterPath.includes('no-poster') &&
        !movie.posterPath.includes('placeholder')) {
      const posterUrl = getPosterUrl(movie.posterPath, 'w500');
      if (posterUrl && 
          !posterUrl.includes('no-poster') && 
          !posterUrl.includes('placeholder') &&
          (posterUrl.startsWith('http://') || posterUrl.startsWith('https://'))) {
        return posterUrl;
      }
    }
  }

  // Last resort: return placeholder
  return '/no-poster.svg';
}

// Function to reset the cache (useful for testing or if genres change)
export function resetGenreImageCache(): void {
  usedMovieIds.clear();
}

