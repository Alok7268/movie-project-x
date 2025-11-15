import { NextRequest, NextResponse } from 'next/server';
import { fetchMoviesFromOMDBByGenre } from '@/lib/movies';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> }
) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);

  try {
    const movies = await fetchMoviesFromOMDBByGenre(decodedGenre);
    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Error fetching movies from OMDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies from OMDB' },
      { status: 500 }
    );
  }
}

