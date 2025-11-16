'use client';

import Link from 'next/link';
import { genreToSlug } from '@/lib/movies';

interface PermutationButton {
  label: string;
  href: string;
}

interface PermutationButtonsProps {
  genres: string[];
  popularActors: string[];
  popularDirectors: string[];
}

export default function PermutationButtons({ 
  genres, 
  popularActors, 
  popularDirectors 
}: PermutationButtonsProps) {
  // Helper function to build URL with query parameters
  const buildUrl = (params: {
    genres?: string[];
    actors?: string[];
    directors?: string[];
  }): string => {
    const searchParams = new URLSearchParams();
    
    if (params.genres) {
      params.genres.forEach(genre => {
        searchParams.append('genre', genreToSlug(genre));
      });
    }
    
    if (params.actors) {
      params.actors.forEach(actor => {
        searchParams.append('actor', encodeURIComponent(actor));
      });
    }
    
    if (params.directors) {
      params.directors.forEach(director => {
        searchParams.append('director', encodeURIComponent(director));
      });
    }
    
    return `/movies?${searchParams.toString()}`;
  };

  // Generate exactly 10 popular and relevant permutations based on local data
  const generatePermutations = (): PermutationButton[] => {
    const buttons: PermutationButton[] = [];
    
    // Ensure we have data to work with
    if (genres.length === 0 && popularActors.length === 0 && popularDirectors.length === 0) {
      return buttons;
    }
    
    // 1-3: Top 3 single genres (most popular genres)
    if (genres.length > 0) {
      genres.slice(0, 3).forEach(genre => {
        buttons.push({
          label: `Best ${genre} Movies`,
          href: buildUrl({ genres: [genre] })
        });
      });
    }
    
    // 4-5: Top 2 genre combinations (if we have enough genres)
    if (genres.length >= 2) {
      // Try to find good genre pairs from the top genres
      for (let i = 0; i < Math.min(2, genres.length - 1) && buttons.length < 10; i++) {
        const genre1 = genres[i];
        const genre2 = genres[i + 1];
        buttons.push({
          label: `Best ${genre1} & ${genre2} Movies`,
          href: buildUrl({ genres: [genre1, genre2] })
        });
      }
    }
    
    // 6-7: Top 2 actors (most popular actors)
    if (popularActors.length > 0 && buttons.length < 10) {
      popularActors.slice(0, 2).forEach(actor => {
        if (buttons.length < 10) {
          buttons.push({
            label: `Best Movies featuring ${actor}`,
            href: buildUrl({ actors: [actor] })
          });
        }
      });
    }
    
    // 8: Genre + Actor combination (top genre with top actor)
    if (genres.length > 0 && popularActors.length > 0 && buttons.length < 10) {
      buttons.push({
        label: `Best ${genres[0]} Movies featuring ${popularActors[0]}`,
        href: buildUrl({ genres: [genres[0]], actors: [popularActors[0]] })
      });
    }
    
    // 9: Top director
    if (popularDirectors.length > 0 && buttons.length < 10) {
      buttons.push({
        label: `Best Movies by ${popularDirectors[0]}`,
        href: buildUrl({ directors: [popularDirectors[0]] })
      });
    }
    
    // 10: Genre + Director combination (top genre with top director)
    if (genres.length > 0 && popularDirectors.length > 0 && buttons.length < 10) {
      buttons.push({
        label: `Best ${genres[0]} Movies by ${popularDirectors[0]}`,
        href: buildUrl({ genres: [genres[0]], directors: [popularDirectors[0]] })
      });
    }
    
    // Return exactly 10 or less
    return buttons.slice(0, 10);
  };

  const permutations = generatePermutations();

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-[#696969] bg-clip-text text-transparent mb-2">
            Explore Movie Permutations
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Discover movies by genre, actor, director, and their combinations
          </p>
        </div>
        
        {permutations.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {permutations.map((perm, index) => (
              <Link
                key={index}
                href={perm.href}
                className="px-4 py-2 rounded-lg bg-[#232323]/50 border border-[#343434]/50 hover:border-[#696969]/50 text-gray-300 hover:text-[#696969] font-medium text-sm transition-all duration-300 hover:bg-[#343434]/70 hover:scale-105 whitespace-nowrap"
              >
                {perm.label}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>No permutations available</p>
          </div>
        )}
      </div>
    </section>
  );
}

