export interface Movie {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  releaseDate: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  runtime: number;
  budget: number;
  revenue: number;
  originalLanguage: string;
  status: string;
  
  genres: string[];
  keywords: string[];
  productionCompanies: string[];
  
  posterPath: string | null;
  backdropPath: string | null;
  
  cast: {
    name: string;
    character: string;
    profilePath: string | null;
  }[];
  director: string | null;
  
  year: number | null;
  decade: number | null;
}

