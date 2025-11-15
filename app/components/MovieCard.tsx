import Image from 'next/image';
import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/movies';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const hasPoster = movie.posterPath !== null;
  const posterUrl = hasPoster ? getPosterUrl(movie.posterPath, 'w500') : '';
  const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null);
  const genres = movie.genres.slice(0, 2);

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-[#33134a]">
      {/* Movie Poster or Placeholder */}
      <div className="relative w-full h-full">
        {hasPoster ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#550b2c] to-[#231758] flex items-center justify-center">
            <div className="text-center p-4">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-[#65071e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <p className="text-gray-200 text-xs line-clamp-2">{movie.title}</p>
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-sm z-10">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {movie.voteAverage.toFixed(1)}
        </div>

        {/* Glass-morphism Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121b67]/90 via-[#231758]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Movie Info on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {year && <span className="text-gray-200 text-sm">{year}</span>}
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-[#76030f]/80 backdrop-blur-sm text-white text-xs rounded-full"
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

