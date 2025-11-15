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
    <section className="py-16 px-6">
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
              className="group relative bg-gradient-to-br from-[#33134a] to-[#231758] rounded-xl p-8 md:p-12 border-2 border-[#440f3b] hover:border-[#76030f] transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#76030f]/0 to-[#550b2c]/0 group-hover:from-[#76030f]/30 group-hover:to-[#550b2c]/30 transition-all duration-300"></div>
              
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

