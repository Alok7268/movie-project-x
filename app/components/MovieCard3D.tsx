"use client";

import Image from 'next/image';
import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/movies';
import { CardBody, CardContainer, CardItem } from './ui/3d-card';

interface MovieCard3DProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard3D({ movie, priority = false }: MovieCard3DProps) {
  const posterUrl = getPosterUrl(movie.posterPath, 'w500');
  const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null);
  const genres = movie.genres.slice(0, 2);

  return (
    <CardContainer className="inter-var w-full h-full" containerClassName="py-0 w-full h-full">
      <CardBody className="bg-black relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full flex flex-col rounded-xl p-3 border border-white/10">
        <CardItem
          translateZ="50"
          className="text-sm md:text-base font-bold text-white mb-2 line-clamp-2 min-h-[2.5rem]"
        >
          {movie.title}
        </CardItem>
        
        <CardItem
          translateZ="100"
          rotateX={10}
          rotateZ={-5}
          className="w-full mt-2 flex-shrink-0"
        >
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-[#1f2937]">
            {posterUrl.endsWith('.svg') ? (
              // Use regular img tag for SVG placeholder files
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-contain rounded-lg group-hover/card:shadow-xl"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            ) : (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover rounded-lg group-hover/card:shadow-xl"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={priority}
                unoptimized={posterUrl.startsWith('http')}
              />
            )}
          </div>
        </CardItem>

        <div className="flex justify-between items-center mt-3 flex-shrink-0 min-h-[2rem]">
          <CardItem
            translateZ={20}
            translateX={-20}
            className="flex items-center gap-2"
          >
            <div className="bg-yellow-400/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full flex items-center gap-1 font-bold text-xs">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {movie.voteAverage.toFixed(1)}
            </div>
          </CardItem>
          
          <CardItem
            translateZ={20}
            translateX={20}
            className="flex items-center gap-1.5 flex-wrap justify-end"
          >
            {year && <span className="text-gray-200 text-[10px] px-1.5 py-0.5 bg-white/10 backdrop-blur-sm rounded-full">{year}</span>}
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-1.5 py-0.5 bg-[#76030f]/80 backdrop-blur-sm text-white text-[10px] rounded-full"
              >
                {genre}
              </span>
            ))}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

