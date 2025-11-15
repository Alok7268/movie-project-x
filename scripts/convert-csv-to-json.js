const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const https = require('https');

// Path to your CSV files
const MOVIES_CSV = path.join(__dirname, '../../archive/tmdb_5000_movies.csv');
const CREDITS_CSV = path.join(__dirname, '../../archive/tmdb_5000_credits.csv');

// Output path
const OUTPUT_PATH = path.join(__dirname, '../public/data/movies.json');

// TMDB API configuration (optional - set via environment variable)
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

console.log('🎬 Starting TMDB data conversion...\n');
if (!TMDB_API_KEY) {
  console.log('⚠️  No TMDB API key found. Set TMDB_API_KEY environment variable to fetch poster images.');
  console.log('   Movies will be processed without poster paths (placeholder images will be used).\n');
}

// Helper function to fetch movie details from TMDB API
function fetchMovieDetails(movieId) {
  return new Promise((resolve, reject) => {
    if (!TMDB_API_KEY) {
      resolve(null);
      return;
    }

    const url = `${TMDB_API_BASE}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const movieData = JSON.parse(data);
            resolve({
              posterPath: movieData.poster_path || null,
              backdropPath: movieData.backdrop_path || null
            });
          } else {
            console.warn(`   ⚠️  Failed to fetch movie ${movieId}: ${res.statusCode}`);
            resolve(null);
          }
        } catch (error) {
          console.warn(`   ⚠️  Error parsing response for movie ${movieId}:`, error.message);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.warn(`   ⚠️  Error fetching movie ${movieId}:`, error.message);
      resolve(null);
    });
  });
}

// Step 1: Read credits data first
const creditsMap = new Map();

function readCredits() {
  return new Promise((resolve, reject) => {
    console.log('📖 Reading credits data...');
    let count = 0;

    fs.createReadStream(CREDITS_CSV)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const movieId = parseInt(row.movie_id);
          
          // Parse cast (it's a JSON string in the CSV)
          let cast = [];
          if (row.cast) {
            const castData = JSON.parse(row.cast);
            cast = castData.slice(0, 10).map(actor => ({
              name: actor.name,
              character: actor.character,
              profilePath: actor.profile_path
            }));
          }

          // Parse crew to get director
          let director = null;
          if (row.crew) {
            const crewData = JSON.parse(row.crew);
            const directorData = crewData.find(person => person.job === 'Director');
            if (directorData) {
              director = directorData.name;
            }
          }

          creditsMap.set(movieId, { cast, director });
          count++;
        } catch (error) {
          console.error(`Error parsing credits for movie ${row.movie_id}:`, error.message);
        }
      })
      .on('end', () => {
        console.log(`✅ Processed ${count} credits entries\n`);
        resolve();
      })
      .on('error', reject);
  });
}

// Step 2: Read movies data and merge with credits
function readMovies() {
  return new Promise((resolve, reject) => {
    console.log('📖 Reading movies data...');
    const movies = [];
    let count = 0;

    fs.createReadStream(MOVIES_CSV)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const movieId = parseInt(row.id);
          
          // Parse JSON fields
          let genres = [];
          if (row.genres) {
            try {
              genres = JSON.parse(row.genres).map(g => g.name);
            } catch (e) {
              console.warn(`Could not parse genres for ${row.title}`);
            }
          }

          let keywords = [];
          if (row.keywords) {
            try {
              keywords = JSON.parse(row.keywords).map(k => k.name);
            } catch (e) {
              // Keywords might be missing, that's okay
            }
          }

          let productionCompanies = [];
          if (row.production_companies) {
            try {
              productionCompanies = JSON.parse(row.production_companies)
                .map(c => c.name)
                .slice(0, 3); // Keep top 3 companies
            } catch (e) {
              // Production companies might be missing
            }
          }

          // Get credits data
          const credits = creditsMap.get(movieId) || { cast: [], director: null };

          // Create movie object
          // Note: poster_path and backdrop_path are not in the CSV, will be fetched from API if available
          const movie = {
            id: movieId,
            title: row.title || 'Untitled',
            tagline: row.tagline || '',
            overview: row.overview || '',
            releaseDate: row.release_date || '',
            popularity: parseFloat(row.popularity) || 0,
            voteAverage: parseFloat(row.vote_average) || 0,
            voteCount: parseInt(row.vote_count) || 0,
            runtime: parseInt(row.runtime) || 0,
            budget: parseInt(row.budget) || 0,
            revenue: parseInt(row.revenue) || 0,
            originalLanguage: row.original_language || 'en',
            status: row.status || 'Released',
            
            // Arrays
            genres: genres,
            keywords: keywords,
            productionCompanies: productionCompanies,
            
            // Images (will be fetched from API if available, otherwise null)
            posterPath: null,
            backdropPath: null,
            
            // Credits
            cast: credits.cast,
            director: credits.director,
            
            // Computed fields
            year: row.release_date ? new Date(row.release_date).getFullYear() : null,
            decade: row.release_date ? Math.floor(new Date(row.release_date).getFullYear() / 10) * 10 : null,
          };

          movies.push(movie);
          count++;
        } catch (error) {
          console.error(`Error parsing movie ${row.title}:`, error.message);
        }
      })
      .on('end', () => {
        console.log(`✅ Processed ${count} movies\n`);
        resolve(movies);
      })
      .on('error', reject);
  });
}

// Step 2.5: Fetch poster/backdrop paths from TMDB API
async function fetchImagePaths(movies) {
  if (!TMDB_API_KEY) {
    console.log('⏭️  Skipping image fetch (no API key provided)\n');
    console.log('📝 To fetch real movie posters:');
    console.log('   1. Get a free API key from: https://www.themoviedb.org/settings/api');
    console.log('   2. Run: TMDB_API_KEY=your_key_here node scripts/convert-csv-to-json.js\n');
    return movies;
  }

  console.log('🖼️  Fetching poster and backdrop paths from TMDB API...');
  console.log(`   Processing ${movies.length} movies (this will take ~${Math.ceil(movies.length * 0.25 / 60)} minutes)...\n`);
  
  const updatedMovies = [];
  let fetched = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    
    // Show progress every 5 movies with time estimate
    if (i % 5 === 0 && i > 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = i / elapsed;
      const remaining = Math.ceil((movies.length - i) / rate);
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      console.log(`   Progress: ${i}/${movies.length} (${fetched} fetched, ${failed} failed) - ~${mins}m ${secs}s remaining`);
    }

    try {
      const imageData = await fetchMovieDetails(movie.id);
      
      if (imageData && imageData.posterPath) {
        movie.posterPath = imageData.posterPath;
        movie.backdropPath = imageData.backdropPath;
        fetched++;
      } else {
        failed++;
      }
      
      // Rate limiting: wait 250ms between requests (40 requests per 10 seconds)
      // TMDB allows 40 requests per 10 seconds
      if (i < movies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.warn(`   ⚠️  Error fetching images for "${movie.title}" (ID: ${movie.id}):`, error.message);
      failed++;
    }

    updatedMovies.push(movie);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Image fetch complete in ${totalTime}s: ${fetched} successful, ${failed} failed\n`);
  return updatedMovies;
}

// Step 3: Filter and sort to get top 250
function processMovies(movies) {
  console.log('🔍 Filtering and sorting movies...');
  
  // Debug: Check what data we have
  console.log(`   Sample movie data:`, {
    voteCount: movies[0]?.voteCount,
    voteAverage: movies[0]?.voteAverage,
    posterPath: movies[0]?.posterPath,
    releaseDate: movies[0]?.releaseDate,
    overview: movies[0]?.overview ? 'exists' : 'missing'
  });
  
  // Filter: only movies with valid data (relaxed criteria)
  // Note: Removed posterPath requirement since it may not be available without API key
  // posterPath is optional - placeholder images will be used if missing
  const filtered = movies.filter(movie => {
    return (
      movie.voteCount > 10 && // At least 10 votes (relaxed)
      movie.voteAverage > 0 && // Has rating
      movie.releaseDate && // Has release date
      movie.overview && // Has description
      movie.title // Has title
    );
  });

  console.log(`   Filtered from ${movies.length} to ${filtered.length} movies`);

  if (filtered.length === 0) {
    console.error('   ❌ No movies passed filtering! Check your CSV data.');
    console.log('   Sample raw movie:', movies[0]);
    return [];
  }

  // Sort by weighted rating (Bayesian average)
  // This gives better results than just vote_average
  const C = 6.5; // Mean rating across all movies
  const m = 100; // Minimum votes required
  
  const sorted = filtered.sort((a, b) => {
    const ratingA = (a.voteCount / (a.voteCount + m)) * a.voteAverage + 
                    (m / (a.voteCount + m)) * C;
    const ratingB = (b.voteCount / (b.voteCount + m)) * b.voteAverage + 
                    (m / (b.voteCount + m)) * C;
    return ratingB - ratingA;
  });

  // Take top 250 (or all if less than 250)
  const top250 = sorted.slice(0, Math.min(250, sorted.length));

  console.log(`   Selected top ${top250.length} movies\n`);
  
  return top250;
}

// Step 4: Save to JSON
function saveToJson(movies) {
  console.log('💾 Saving to JSON...');
  
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Save movies
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(movies, null, 2));
  
  console.log(`✅ Saved ${movies.length} movies to ${OUTPUT_PATH}`);
  
  // Print statistics
  console.log('\n📊 Statistics:');
  console.log(`   Total movies: ${movies.length}`);
  
  if (movies.length > 0) {
    console.log(`   Date range: ${movies[movies.length - 1].year} - ${movies[0].year}`);
    console.log(`   Top rated: ${movies[0].title} (${movies[0].voteAverage})`);
    console.log(`   Genres: ${[...new Set(movies.flatMap(m => m.genres))].length} unique`);
    
    // Show first movie as sample
    console.log('\n📄 Sample movie data:');
    console.log(JSON.stringify(movies[0], null, 2).substring(0, 500) + '...');
  } else {
    console.log('   ⚠️  No movies to display statistics for.');
  }
}

// Main execution
async function main() {
  try {
    // Read credits first
    await readCredits();
    
    // Read movies and merge with credits
    const movies = await readMovies();
    
    // Fetch image paths from TMDB API if API key is available
    const moviesWithImages = await fetchImagePaths(movies);
    
    // Process and filter
    const top250 = processMovies(moviesWithImages);
    
    // Save to JSON
    saveToJson(top250);
    
    console.log('\n✨ Conversion complete! Your data is ready to use.\n');
    if (!TMDB_API_KEY) {
      console.log('💡 Tip: To fetch poster images, set TMDB_API_KEY environment variable and run again.');
      console.log('   Get your API key from: https://www.themoviedb.org/settings/api\n');
    }
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the script
main();

