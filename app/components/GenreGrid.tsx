'use client';

interface GenreGridProps {
  genres: string[];
  onGenreClick?: (genre: string) => void;
}

export default function GenreGrid({ genres, onGenreClick }: GenreGridProps) {
  const handleGenreClick = (genre: string) => {
    onGenreClick?.(genre);
    // Navigate to genre page or filter movies
    // This can be extended later
  };

  return (
    <section className="py-16 px-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Browse by Genre
        </h2>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 md:p-12 border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
              
              {/* Genre Name */}
              <span className="relative z-10 text-white text-lg md:text-xl font-bold text-center block">
                {genre}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

