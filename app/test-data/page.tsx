import { getAllMovies, getAllGenres, getPosterUrl } from '@/lib/movies';
import Image from 'next/image';

export default function TestDataPage() {
  const movies = getAllMovies();
  const genres = getAllGenres();
  const topMovie = movies[0];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Data Test Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Statistics</h2>
          <p>Total movies: {movies.length}</p>
          <p>Total genres: {genres.length}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">All Genres</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <span key={genre} className="px-3 py-1 bg-gray-200 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Top Rated Movie</h2>
          <div className="flex gap-4">
            <Image
              src={getPosterUrl(topMovie.posterPath)}
              alt={topMovie.title}
              width={200}
              height={300}
              className="rounded"
            />
            <div>
              <h3 className="text-2xl font-bold">{topMovie.title}</h3>
              <p className="text-gray-600">{topMovie.year}</p>
              <p className="mt-2">Rating: {topMovie.voteAverage}/10</p>
              <p>Director: {topMovie.director}</p>
              <p className="mt-2">{topMovie.overview.substring(0, 200)}...</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">All Movies (First 10)</h2>
          <div className="grid grid-cols-5 gap-4">
            {movies.slice(0, 10).map(movie => (
              <div key={movie.id}>
                <Image
                  src={getPosterUrl(movie.posterPath, 'w200')}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded"
                />
                <p className="mt-2 text-sm">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

