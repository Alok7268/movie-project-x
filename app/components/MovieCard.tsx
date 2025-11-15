"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/movies';
import { IconPhotoOff, IconMovie } from '@tabler/icons-react';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const posterUrl = getPosterUrl(movie.posterPath, 'w500');
  const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null);
  const genres = movie.genres.slice(0, 2);
  const hasPoster = posterUrl && !posterUrl.endsWith('.svg') && !posterUrl.includes('no-poster') && !posterUrl.includes('placeholder') && !imageError;

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ffc300]/20 bg-gradient-to-br from-[#001d3d] to-[#000814] border border-[#003566]/30">
      {/* Movie Poster or Placeholder */}
      <div className="relative w-full h-full bg-gradient-to-br from-[#001d3d] via-[#000814] to-[#003566]">
        {hasPoster ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            unoptimized={posterUrl.startsWith('http')}
            onError={() => {
              // Fallback to placeholder if image fails to load
              setImageError(true);
            }}
          />
        ) : (
          // Custom "No Image" Placeholder
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#001d3d]/80 via-[#000814] to-[#003566]/60">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-[#ffc300]/10 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-[#001d3d] to-[#003566] p-6 rounded-2xl border-2 border-[#003566]/50 shadow-lg">
                <IconPhotoOff className="w-12 h-12 text-[#ffc300]/60" />
              </div>
            </div>
            <div className="text-center">
              <IconMovie className="w-8 h-8 text-[#ffc300]/40 mx-auto mb-2" />
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">No Image</p>
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        {(movie.voteAverage != null && !isNaN(movie.voteAverage) && movie.voteAverage > 0) && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ffc300] to-[#ffd60a] backdrop-blur-sm text-[#000814] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-sm z-10 shadow-lg shadow-[#ffc300]/30">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.voteAverage.toFixed(1)}
          </div>
        )}

        {/* Glass-morphism Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000814]/95 via-[#001d3d]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Movie Info on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#ffc300] transition-colors duration-300">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {year && <span className="text-gray-200 text-sm bg-[#003566]/60 px-2 py-1 rounded-full border border-[#003566]/80">{year}</span>}
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-[#001d3d]/80 backdrop-blur-sm text-[#ffc300] text-xs rounded-full border border-[#003566]/50 font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

