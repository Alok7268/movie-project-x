import { notFound } from 'next/navigation';
import { getMoviesByGenre, findGenreBySlug, getAllGenres, fetchMoviesFromOMDBByGenre, slugToGenre } from '@/lib/movies';
import FeaturedMovies from '../components/FeaturedMovies';
import NavigationHeader from '../components/NavigationHeader';
import Footer from '../components/Footer';
import SparklesBackground from '../components/SparklesBackground';

interface GenrePageProps {
  params: Promise<{
    genre: string;
  }>;
}

// Generate static params for known genres (optional, helps with performance)
export async function generateStaticParams() {
  const genres = getAllGenres();
  return genres.map((genre) => ({
    genre: genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  }));
}

export default async function GenrePage({ params }: GenrePageProps) {
  // Await params (required in Next.js 16)
  const { genre } = await params;
  
  // Decode the genre slug and find the actual genre name
  const genreSlug = decodeURIComponent(genre);
  let genreName = findGenreBySlug(genreSlug);

  // If genre not found in local data, use the slug as genre name (capitalize it)
  // This allows us to fetch from OMDB even for genres not in local data
  if (!genreName) {
    // Convert slug back to readable genre name using existing function
    genreName = slugToGenre(genreSlug);
  }

  // Get movies for this genre from local data (now case-insensitive)
  let genreMovies = getMoviesByGenre(genreName);

  // If no local movies found, try fetching from OMDB API
  if (genreMovies.length === 0) {
    try {
      console.log(`No local movies found for "${genreName}", fetching from OMDB...`);
      genreMovies = await fetchMoviesFromOMDBByGenre(genreName);
      console.log(`Found ${genreMovies.length} movies from OMDB for "${genreName}"`);
    } catch (error) {
      console.error('Error fetching movies from OMDB:', error);
      // Continue with empty array if fetch fails
    }
  }

  // If still no movies found after OMDB fetch, show 404
  if (genreMovies.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen relative bg-[#000814]">
      {/* Sparkles Background */}
      <SparklesBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <NavigationHeader />
        
        {/* Genre Header Section */}
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-4">
              {genreName} Movies
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Discover {genreMovies.length} amazing {genreName.toLowerCase()} {genreMovies.length === 1 ? 'movie' : 'movies'}
            </p>
          </div>
        </section>

        {/* Movies Grid */}
        {genreMovies.length > 0 ? (
          <FeaturedMovies 
            movies={genreMovies} 
            title=""
            showViewAll={false}
          />
        ) : (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400 text-xl">No movies found in this genre.</p>
            </div>
          </section>
        )}
        
        <Footer />
      </div>
    </div>
  );
}

