import { getAllMovies, getAllGenres, getTopRated, getYearRange } from '@/lib/movies';
import HeroSection from './components/HeroSection';
import FeaturedMovies from './components/FeaturedMovies';
import GenreGrid from './components/GenreGrid';
import NavigationHeader from './components/NavigationHeader';
import Footer from './components/Footer';

export default function Home() {
  // Get data
  const allMovies = getAllMovies();
  const allGenres = getAllGenres();
  const topMovies = getTopRated(10);
  const yearRange = getYearRange();

  // Calculate stats
  const stats = {
    total: allMovies.length,
    genres: allGenres.length,
    years: yearRange,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <NavigationHeader />
      <HeroSection stats={stats} />
      <FeaturedMovies movies={topMovies} />
      <GenreGrid genres={allGenres} />
      <Footer />
    </div>
  );
}
