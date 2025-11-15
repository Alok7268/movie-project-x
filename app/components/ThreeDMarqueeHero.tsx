"use client";

import { ThreeDMarquee } from "./ui/3d-marquee";
import { getAllMovies, getPosterUrl } from "@/lib/movies";
import { Movie } from "@/types/movie";

interface ThreeDMarqueeHeroProps {
  stats?: {
    total: number;
    genres: number;
    years: string;
  };
}

export default function ThreeDMarqueeHero({ stats }: ThreeDMarqueeHeroProps) {
  // Get all movies and extract poster images
  const allMovies = getAllMovies();
  
  // Filter movies with valid poster paths and get their poster URLs
  const movieImages = allMovies
    .filter((movie: Movie) => 
      movie.posterPath && 
      movie.posterPath.trim() !== '' && 
      !movie.posterPath.includes('no-poster') &&
      !movie.posterPath.includes('placeholder')
    )
    .map((movie: Movie) => getPosterUrl(movie.posterPath, 'w500'))
    .filter((url: string) => 
      url && 
      !url.includes('no-poster') && 
      !url.includes('placeholder') &&
      (url.startsWith('http://') || url.startsWith('https://'))
    )
    .slice(0, 32); // Get 32 images for the marquee (8 per column)

  // If we don't have enough images, duplicate the array
  const images = movieImages.length >= 32 
    ? movieImages 
    : [...movieImages, ...movieImages, ...movieImages, ...movieImages].slice(0, 32);

  return (
    <div className="relative mx-auto my-10 flex min-h-[90vh] w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl px-6">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Discover Your Next{" "}
        <span className="relative z-20 inline-block rounded-xl bg-[#ffc300]/40 px-4 py-1 text-white underline decoration-[#ffd60a] decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          Favorite Movie
        </span>{" "}
        Experience
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Explore our curated collection of {stats?.total.toLocaleString() || 'thousands'} movies from {stats?.years || 'various years'}. 
        From timeless classics to modern masterpieces, find your perfect watch.
      </p>
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-[#ffc300] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#ffd60a] focus:ring-2 focus:ring-[#ffc300] focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Browse Movies
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Explore Genres
        </button>
      </div>
      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}

