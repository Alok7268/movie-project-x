const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Path to your CSV files
const MOVIES_CSV = path.join(__dirname, '../../archive/tmdb_5000_movies.csv');
const CREDITS_CSV = path.join(__dirname, '../../archive/tmdb_5000_credits.csv');

// Output path
const OUTPUT_PATH = path.join(__dirname, '../public/data/movies.json');

console.log('🎬 Starting TMDB data conversion...\n');

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
            
            // Images (TMDB paths)
            posterPath: row.poster_path || null,
            backdropPath: row.backdrop_path || null,
            
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
    
    // Process and filter
    const top250 = processMovies(movies);
    
    // Save to JSON
    saveToJson(top250);
    
    console.log('\n✨ Conversion complete! Your data is ready to use.\n');
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the script
main();

