'use client';

import { InfiniteMovingCards } from './ui/infinite-moving-cards';
import { getGenreImage } from '@/lib/movies';

interface GenreGridProps {
  genres: string[];
  onGenreClick?: (genre: string) => void;
}

export default function GenreGrid({ genres, onGenreClick }: GenreGridProps) {
  // Convert genres to the format expected by InfiniteMovingCards
  // Image selection is now deterministic, so no cache reset needed
  const genreItems = genres.map((genre) => ({
    quote: genre,
    name: genre,
    title: genre,
    image: getGenreImage(genre),
  }));

  // Split genres into 3 groups for 3 rows
  const chunkSize = Math.ceil(genres.length / 3);
  const row1Genres = genreItems.slice(0, chunkSize);
  const row2Genres = genreItems.slice(chunkSize, chunkSize * 2);
  const row3Genres = genreItems.slice(chunkSize * 2);

  return (
    <section className="py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#696969] bg-clip-text text-transparent text-center mb-8 md:mb-12">
          Browse by Genre
        </h2>

        {/* Three Rows of Infinite Moving Cards */}
        <div className="space-y-2">
          {/* Row 1 - Moving Right, Fast */}
          <div className="h-[140px] sm:h-[160px] md:h-[180px] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              items={row1Genres}
              direction="right"
              speed="fast"
              onItemClick={(item) => onGenreClick?.(item.name)}
            />
          </div>

          {/* Row 2 - Moving Left, Normal */}
          <div className="h-[140px] sm:h-[160px] md:h-[180px] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              items={row2Genres}
              direction="left"
              speed="normal"
              onItemClick={(item) => onGenreClick?.(item.name)}
            />
          </div>

          {/* Row 3 - Moving Right, Slow */}
          <div className="h-[140px] sm:h-[160px] md:h-[180px] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden z-30">
            <InfiniteMovingCards
              items={row3Genres}
              direction="right"
              speed="slow"
              onItemClick={(item) => onGenreClick?.(item.name)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

