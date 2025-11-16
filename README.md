# 🎬 Movie Directory

A modern, feature-rich movie discovery platform built with Next.js 16, React 19, and TypeScript. Explore thousands of movies across multiple genres, search by title, actor, director, or plot, and discover your next favorite film.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8)

## ✨ Features

- 🎯 **Advanced Search**: Search movies by title, actor, director, or plot description
- 🎭 **Genre Browsing**: Browse movies by genre with beautiful genre grid layout
- 🎬 **Movie Filtering**: Filter movies by multiple criteria:
  - Genres (multiple selection)
  - Actors
  - Directors
  - Years and Decades
  - Minimum rating
  - Minimum vote count
- ⭐ **Top Rated Movies**: Discover the highest-rated films
- 🎨 **Modern UI**: Beautiful 3D animations, sparkles background, and responsive design
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔍 **API Integration**: Supports both local movie database and OMDB API
- 🚀 **SEO Optimized**: Built-in metadata, sitemap, and robots.txt
- 🎪 **Interactive Components**: 3D cards, marquee effects, expandable cards, and more

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **3D Graphics**: [Spline](https://spline.design/) via `@splinetool/react-spline`
- **Particles**: [TSParticles](https://particles.js.org/)
- **Icons**: [Tabler Icons](https://tabler.io/icons)
- **Data Source**: TMDB Dataset (5000+ movies)

## 📊 Dataset

### Dataset Used

This project uses the **TMDB 5000 Movies Dataset**, which contains metadata for over 5,000 movies from [The Movie Database (TMDB)](https://www.themoviedb.org/).

**Source URLs:**
- **Kaggle Dataset**: [TMDB 5000 Movie Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)
- **Direct Download**: The dataset consists of two CSV files:
  - `tmdb_5000_movies.csv` - Contains movie metadata (title, overview, genres, ratings, etc.)
  - `tmdb_5000_credits.csv` - Contains cast and crew information

**Dataset Information:**
- **Total Movies**: 5,000+ movies
- **Data Fields**: Title, overview, genres, keywords, production companies, ratings, release dates, budget, revenue, cast, directors, and more
- **Time Period**: Movies from various decades
- **License**: The dataset is available for public use on Kaggle

### Data Processing & Generation

The movie data is processed and converted from CSV format to JSON using custom Node.js scripts. Here's how the data pipeline works:

#### 1. **CSV to JSON Conversion** (`scripts/convert-csv-to-json.js`)

The conversion script performs the following steps:

1. **Read Credits Data**: Parses `tmdb_5000_credits.csv` to extract:
   - Cast information (actors and characters)
   - Director information from crew data

2. **Read Movies Data**: Parses `tmdb_5000_movies.csv` to extract:
   - Basic movie information (title, overview, release date)
   - Genres, keywords, and production companies (stored as JSON strings in CSV)
   - Ratings, vote counts, popularity metrics
   - Budget, revenue, runtime, and language information

3. **Merge Data**: Combines movie data with credits data using movie ID as the key

4. **Fetch Images** (Optional): If a TMDB API key is provided:
   - Fetches poster and backdrop image paths from TMDB API
   - Respects rate limits (40 requests per 10 seconds)
   - Adds image URLs to movie objects

5. **Filter & Sort**: 
   - Filters movies based on quality criteria:
     - Minimum 10 votes
     - Valid rating (vote average > 0)
     - Has release date and overview
   - Sorts using Bayesian average (weighted rating formula) for better ranking
   - Selects top 250 movies by default

6. **Save to JSON**: Outputs processed data to `public/data/movies.json`

**Usage:**
```bash
# Basic conversion (without images)
node scripts/convert-csv-to-json.js

# With TMDB API key for poster images
TMDB_API_KEY=your_key_here node scripts/convert-csv-to-json.js
```

#### 2. **OMDb Poster Enrichment** (`scripts/fetch-posters-omdb.js`)

An optional script to enrich movie data with poster images from OMDb API:

1. **Load Existing Data**: Reads the generated `movies.json` file
2. **Fetch Missing Posters**: For movies without poster paths:
   - Searches OMDb API by movie title and year
   - Retrieves poster URLs
   - Updates movie objects with poster and backdrop paths
3. **Rate Limiting**: Waits 200ms between requests (respects OMDb free tier: 1000 requests/day)
4. **Backup & Save**: Creates a backup before updating the JSON file

**Usage:**
```bash
OMDB_API_KEY=your_key_here node scripts/fetch-posters-omdb.js
```

#### Data Processing Flow

```
CSV Files (archive/)
    ↓
[convert-csv-to-json.js]
    ├── Parse CSV files
    ├── Extract JSON fields (genres, keywords, cast)
    ├── Merge credits data
    ├── (Optional) Fetch images from TMDB API
    ├── Filter & sort movies
    └── Save to JSON
    ↓
movies.json (public/data/)
    ↓
[fetch-posters-omdb.js] (Optional)
    ├── Load movies.json
    ├── Fetch missing posters from OMDb
    └── Update movies.json
    ↓
Final Dataset Ready for Application
```

#### Key Processing Details

- **JSON Parsing**: The CSV files contain JSON strings for complex fields (genres, keywords, cast, crew), which are parsed during conversion
- **Data Normalization**: 
  - Computes `year` and `decade` from release dates
  - Normalizes genre names
  - Limits cast to top 10 actors
  - Limits production companies to top 3
- **Image Handling**: 
  - Primary source: TMDB API (requires API key)
  - Fallback: OMDb API (requires API key)
  - Final fallback: Local placeholder SVGs (`no-poster.svg`, `no-backdrop.svg`)
- **Quality Filtering**: Only includes movies with sufficient data quality (votes, ratings, descriptions)

#### Getting the Dataset

To obtain the original dataset:

1. **From Kaggle**:
   - Visit: https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata
   - Download the dataset
   - Extract CSV files to `archive/` directory

2. **File Structure**:
   ```
   archive/
   ├── tmdb_5000_movies.csv
   └── tmdb_5000_credits.csv
   ```

3. **Run Conversion**:
   ```bash
   node scripts/convert-csv-to-json.js
   ```

The processed JSON file will be available at `public/data/movies.json` and used by the application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- (Optional) **OMDB API Key** for extended movie search capabilities

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/movie-directory.git
cd movie-directory
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: OMDB API Key for extended search functionality
# Get your free API key at: https://www.omdbapi.com/apikey.aspx
OMDB_API_KEY=your_omdb_api_key_here

# Optional: Site URL for metadata (defaults to http://localhost:3000)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
movie-directory/
├── app/                          # Next.js App Router directory
│   ├── [genre]/                  # Dynamic genre pages
│   │   └── page.tsx
│   ├── api/                      # API routes
│   │   ├── movies/
│   │   │   └── genre/
│   │   │       └── [genre]/
│   │   │           └── route.ts  # OMDB genre API endpoint
│   │   └── search/
│   │       └── route.ts          # Search API endpoint
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── 3d-card.tsx
│   │   │   ├── 3d-marquee.tsx
│   │   │   ├── expandable-card.tsx
│   │   │   ├── infinite-moving-cards.tsx
│   │   │   └── sparkles.tsx
│   │   ├── FeaturedMovies.tsx
│   │   ├── Footer.tsx
│   │   ├── GenreGrid.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HomeClient.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieCard3D.tsx
│   │   ├── NavigationHeader.tsx
│   │   ├── PermutationButtons.tsx
│   │   ├── SearchResultsModal.tsx
│   │   ├── SparklesBackground.tsx
│   │   ├── SplineBackground.tsx
│   │   └── ThreeDMarqueeHero.tsx
│   ├── genres/
│   │   ├── GenresClient.tsx
│   │   └── page.tsx
│   ├── movies/
│   │   └── page.tsx              # Movies listing with filters
│   ├── search/
│   │   ├── SearchContent.tsx
│   │   └── page.tsx
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # Robots.txt
│   └── sitemap.ts                # Sitemap generation
├── archive/                      # Original CSV data files
│   ├── tmdb_5000_credits.csv
│   └── tmdb_5000_movies.csv
├── hooks/                        # Custom React hooks
│   └── use-outside-click.tsx
├── lib/                          # Utility functions
│   ├── movies.ts                 # Movie data functions
│   └── utils.ts                  # General utilities
├── public/                       # Static assets
│   ├── data/
│   │   └── movies.json           # Processed movie data
│   ├── images/                   # Image assets
│   ├── no-backdrop.svg
│   └── no-poster.svg
├── scripts/                      # Data processing scripts
│   ├── convert-csv-to-json.js   # CSV to JSON converter
│   └── fetch-posters-omdb.js    # Poster fetcher
├── types/                        # TypeScript type definitions
│   └── movie.ts                  # Movie interface
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🔧 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Data Processing

The project includes scripts to process movie data:

```bash
# Convert CSV files to JSON (requires TMDB API key)
TMDB_API_KEY=your_key node scripts/convert-csv-to-json.js

# Fetch posters from OMDB
OMDB_API_KEY=your_key node scripts/fetch-posters-omdb.js
```

## 📡 API Routes

### Search Movies

Search for movies by query string.

**Endpoint**: `GET /api/search?q={query}`

**Example Request**:
```bash
curl http://localhost:3000/api/search?q=inception
```

**Example Response**:
```json
{
  "query": "inception",
  "localCount": 1,
  "omdbCount": 10,
  "totalCount": 11,
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "Cobb, a skilled thief...",
      "voteAverage": 8.8,
      "genres": ["Action", "Science Fiction", "Thriller"],
      ...
    }
  ]
}
```

### Get Movies by Genre (OMDB)

Fetch movies from OMDB API by genre.

**Endpoint**: `GET /api/movies/genre/{genre}`

**Example Request**:
```bash
curl http://localhost:3000/api/movies/genre/action
```

**Example Response**:
```json
{
  "movies": [
    {
      "id": 12345,
      "title": "Action Movie",
      "genres": ["Action"],
      ...
    }
  ]
}
```

## 💻 Code Examples

### Using Movie Functions

```typescript
import { 
  getAllMovies, 
  getMoviesByGenre, 
  searchMovies,
  filterMovies 
} from '@/lib/movies';

// Get all movies
const allMovies = getAllMovies();

// Get movies by genre
const actionMovies = getMoviesByGenre('Action');

// Search movies
const results = searchMovies('inception');

// Advanced filtering
const filtered = filterMovies({
  genres: ['Action', 'Thriller'],
  minRating: 7.5,
  years: [2010, 2011, 2012]
});
```

### Movie Type Definition

```typescript
interface Movie {
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
```

### Creating a Custom Movie Component

```typescript
'use client';

import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/movies';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.posterPath);
  
  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      <div className="rating">⭐ {movie.voteAverage}</div>
    </div>
  );
}
```

## 🎨 Key Features Explained

### 1. Genre-Based Navigation

Movies can be accessed via genre slugs:
- `/action` - Action movies
- `/comedy` - Comedy movies
- `/drama` - Drama movies
- etc.

### 2. Advanced Filtering

The `/movies` page supports URL-based filtering:

```
/movies?genre=Action&genre=Thriller&minRating=7.5&year=2010
```

### 3. Search Functionality

The search page (`/search`) allows real-time searching across:
- Movie titles
- Plot descriptions
- Actor names
- Director names

### 4. Image Handling

The app handles movie images with fallbacks:
- TMDB image URLs
- OMDB image URLs
- Local placeholder SVGs

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OMDB_API_KEY` | API key for OMDB integration | No | - |
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata | No | `http://localhost:3000` |

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/movie-directory)

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build preset
- **AWS Amplify**: Connect your GitHub repository
- **Railway**: Deploy with one click
- **Docker**: Build using the included Dockerfile (if provided)

### Build for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie dataset
- [OMDB API](https://www.omdbapi.com/) for additional movie data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All the open-source contributors and libraries used in this project

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check existing issues and discussions
- Review the documentation

## 🎯 Roadmap

Future enhancements planned:

- [ ] User authentication and favorites
- [ ] Movie recommendations based on viewing history
- [ ] Watchlist functionality
- [ ] Movie reviews and ratings
- [ ] Social sharing features
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support

---

Made with ❤️ using Next.js and React
