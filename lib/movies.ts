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
  if (!genre || typeof genre !== 'string') {
    return [];
  }
  
  // Normalize genre name for comparison (trim, lowercase)
  const normalizedGenre = genre.trim().toLowerCase();
  
  return movies.filter(m => 
    m.genres.some(g => g.trim().toLowerCase() === normalizedGenre)
  );
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

// Deterministic genre image selection - always returns the same image for the same genre
// This ensures server and client render the same HTML (no hydration mismatch)
export function getGenreImage(genre: string): string {
  // Get all movies in this genre, sorted by popularity and rating
  // Sort is deterministic, so same genre always gets same order
  const allGenreMovies = getMoviesByGenre(genre).sort((a, b) => {
    // Sort by vote average first, then by popularity, then by ID for consistency
    if (b.voteAverage !== a.voteAverage) {
      return b.voteAverage - a.voteAverage;
    }
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }
    return a.id - b.id; // Stable sort by ID
  });

  if (allGenreMovies.length === 0) {
    // Return placeholder if no movies in genre
    return '/no-poster.svg';
  }

  // Use hash of genre name to select a consistent movie index for each genre
  // This ensures each genre always gets the same movie (deterministic)
  const genreHash = hashString(genre);
  const startIndex = genreHash % allGenreMovies.length;
  
  // Create a rotated list starting from the hashed index
  const moviesToCheck = [
    ...allGenreMovies.slice(startIndex),
    ...allGenreMovies.slice(0, startIndex)
  ];

  // Find the first movie with a valid poster (deterministic selection)
  for (const movie of moviesToCheck) {
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
        return posterUrl;
      }
    }
  }

  // If no poster found, try backdrops
  for (const movie of moviesToCheck) {
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
        return backdropUrl;
      }
    }
  }

  // Last resort: return placeholder
  return '/no-poster.svg';
}

// Function kept for backward compatibility, but no longer needed
// Image selection is now deterministic and doesn't use a cache
export function resetGenreImageCache(): void {
  // No-op: cache is no longer used
}

// Convert genre name to URL-friendly format (lowercase, replace spaces with hyphens)
export function genreToSlug(genre: string): string {
  return genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Convert URL slug back to genre name (capitalize first letter of each word)
export function slugToGenre(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Find genre by slug (case-insensitive, handles variations)
export function findGenreBySlug(slug: string): string | null {
  if (!slug || typeof slug !== 'string') {
    return null;
  }
  
  const allGenres = getAllGenres();
  // Normalize the slug: lowercase, trim, replace spaces with hyphens
  const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // First try exact match with genreToSlug
  for (const genre of allGenres) {
    const genreSlug = genreToSlug(genre);
    if (genreSlug === normalizedSlug) {
      return genre;
    }
  }
  
  // Try direct lowercase comparison (for simple genres like "action")
  const directMatch = normalizedSlug.replace(/-/g, ' ');
  for (const genre of allGenres) {
    if (genre.toLowerCase().replace(/\s+/g, '-') === normalizedSlug) {
      return genre;
    }
  }
  
  // Try matching without hyphens (e.g., "sciencefiction" matches "Science Fiction")
  const slugWithoutHyphens = normalizedSlug.replace(/-/g, '');
  for (const genre of allGenres) {
    const genreWithoutSpaces = genre.toLowerCase().replace(/\s+/g, '');
    if (genreWithoutSpaces === slugWithoutHyphens) {
      return genre;
    }
  }
  
  return null;
}

// Fetch movies from OMDB API by genre
export async function fetchMoviesFromOMDBByGenre(genre: string): Promise<Movie[]> {
  const OMDB_API_KEY = process.env.OMDB_API_KEY || '';

  if (!OMDB_API_KEY) {
    console.warn('OMDB_API_KEY not set, cannot fetch from OMDB');
    return [];
  }

  const movies: Movie[] = [];
  
  // Common search terms for each genre to find relevant movies
  const genreSearchTerms: Record<string, string[]> = {
    'drama': ['drama', 'emotional', 'serious'],
    'action': ['action', 'thriller', 'adventure'],
    'comedy': ['comedy', 'funny', 'humor'],
    'horror': ['horror', 'scary', 'thriller'],
    'romance': ['romance', 'love', 'romantic'],
    'sci-fi': ['sci-fi', 'science fiction', 'space'],
    'science fiction': ['sci-fi', 'science fiction', 'space'],
    'thriller': ['thriller', 'suspense', 'mystery'],
    'fantasy': ['fantasy', 'magic', 'wizard'],
    'animation': ['animation', 'animated', 'cartoon'],
    'crime': ['crime', 'gangster', 'mafia'],
    'documentary': ['documentary', 'documentary film'],
    'family': ['family', 'kids', 'children'],
    'mystery': ['mystery', 'detective', 'investigation'],
    'war': ['war', 'military', 'soldier'],
    'western': ['western', 'cowboy', 'frontier'],
    'musical': ['musical', 'music', 'song'],
    'sport': ['sport', 'sports', 'athlete'],
    'biography': ['biography', 'biographical', 'true story'],
    'history': ['history', 'historical', 'period'],
    'adventure': ['adventure', 'journey', 'quest'],
  };

  // Normalize genre name
  const normalizedGenre = genre.trim().toLowerCase();
  
  // Get search terms for this genre (default to genre name if not found)
  const searchTerms = genreSearchTerms[normalizedGenre] || [normalizedGenre];
  
  // Try multiple search terms to get better results
  for (const searchTerm of searchTerms.slice(0, 2)) { // Try first 2 search terms
    try {
      // Use OMDB search endpoint
      const searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=movie&apikey=${OMDB_API_KEY}&page=1`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.Response === 'True' && searchData.Search) {
        // Limit to first 20 results to avoid too many API calls
        const searchResults = searchData.Search.slice(0, 20);
        
        // Fetch detailed info for each movie
        for (const result of searchResults) {
          try {
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const detailUrl = `https://www.omdbapi.com/?i=${result.imdbID}&apikey=${OMDB_API_KEY}`;
            const detailResponse = await fetch(detailUrl);
            const detailData = await detailResponse.json();

            if (detailData.Response === 'True') {
              // Check if movie matches the genre - improved matching
              const movieGenres = detailData.Genre?.split(',').map((g: string) => g.trim().toLowerCase()) || [];
              const matchesGenre = movieGenres.some((g: string) => {
                const gLower = g.toLowerCase();
                return gLower === normalizedGenre || 
                       gLower.includes(normalizedGenre) ||
                       normalizedGenre.includes(gLower) ||
                       // Handle common variations
                       (normalizedGenre === 'sci-fi' && (gLower === 'science fiction' || gLower.includes('sci-fi'))) ||
                       (normalizedGenre === 'science fiction' && (gLower === 'sci-fi' || gLower.includes('science fiction')));
              });

              if (matchesGenre) {
                // Map OMDB response to our Movie type
                const year = detailData.Year ? parseInt(detailData.Year.split('–')[0]) : null;
                const movie: Movie = {
                  id: parseInt(result.imdbID.replace('tt', '')) || Date.now() + Math.random(),
                  title: detailData.Title || result.Title,
                  tagline: '',
                  overview: detailData.Plot || '',
                  releaseDate: detailData.Released || detailData.Year || '',
                  popularity: 0,
                  voteAverage: detailData.imdbRating ? parseFloat(detailData.imdbRating) : 0,
                  voteCount: detailData.imdbVotes ? parseInt(detailData.imdbVotes.replace(/,/g, '')) : 0,
                  runtime: detailData.Runtime ? parseInt(detailData.Runtime.replace(' min', '')) : 0,
                  budget: 0,
                  revenue: 0,
                  originalLanguage: detailData.Language?.split(',')[0] || 'en',
                  status: 'Released',
                  genres: movieGenres,
                  keywords: [],
                  productionCompanies: detailData.Production?.split(',').map((p: string) => p.trim()) || [],
                  posterPath: detailData.Poster && detailData.Poster !== 'N/A' ? detailData.Poster : null,
                  backdropPath: detailData.Poster && detailData.Poster !== 'N/A' ? detailData.Poster : null,
                  cast: detailData.Actors?.split(',').slice(0, 5).map((actor: string) => ({
                    name: actor.trim(),
                    character: '',
                    profilePath: null,
                  })) || [],
                  director: detailData.Director || null,
                  year: year,
                  decade: year ? Math.floor(year / 10) * 10 : null,
                };
                
                movies.push(movie);
                
                // Limit to 12 movies per genre
                if (movies.length >= 12) break;
              }
            }
          } catch (error) {
            console.error(`Error fetching details for ${result.imdbID}:`, error);
            continue;
          }
        }
        
        // If we found enough movies, break out of search terms loop
        if (movies.length >= 12) break;
      }
    } catch (error) {
      console.error(`Error searching OMDB for genre ${genre} with term ${searchTerm}:`, error);
      continue; // Try next search term
    }
  }

  return movies;
}

