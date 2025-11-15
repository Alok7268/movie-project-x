import { NextRequest, NextResponse } from 'next/server';
import { searchMovies, searchMoviesFromOMDB } from '@/lib/movies';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Search local movies
    const localMovies = searchMovies(query.trim());

    // Search OMDB API (limit to 10 to avoid too many API calls)
    const omdbMovies = await searchMoviesFromOMDB(query.trim(), 10);

    // Combine results, prioritizing local movies
    // Remove duplicates based on title (case-insensitive)
    const allMovies = [...localMovies];
    const localTitles = new Set(localMovies.map(m => m.title.toLowerCase().trim()));
    
    for (const omdbMovie of omdbMovies) {
      if (!localTitles.has(omdbMovie.title.toLowerCase().trim())) {
        allMovies.push(omdbMovie);
      }
    }

    return NextResponse.json({
      query: query.trim(),
      localCount: localMovies.length,
      omdbCount: omdbMovies.length,
      totalCount: allMovies.length,
      movies: allMovies,
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    );
  }
}

