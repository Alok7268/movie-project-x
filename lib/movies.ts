import moviesData from '@/public/data/movies.json';
import { Movie } from '@/types/movie';

const movies = moviesData as Movie[];

// TMDB image base URL
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getPosterUrl(posterPath: string | null, size: 'w200' | 'w500' | 'original' = 'w500') {
  if (!posterPath) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!backdropPath) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`;
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

