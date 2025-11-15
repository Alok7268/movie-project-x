const fs = require('fs');
const path = require('path');
const https = require('https');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

if (!OMDB_API_KEY) {
  console.error('❌ Error: OMDB_API_KEY environment variable is required');
  console.log('📝 Get your FREE API key from: http://www.omdbapi.com/apikey.aspx');
  console.log('📝 Then run: OMDB_API_KEY=your_key_here node scripts/fetch-posters-omdb.js');
  process.exit(1);
}

const MOVIES_JSON = path.join(__dirname, '../public/data/movies.json');

console.log('🎬 Fetching movie posters from OMDb API...\n');

if (!fs.existsSync(MOVIES_JSON)) {
  console.error(`❌ Error: ${MOVIES_JSON} not found!`);
  console.log('📝 Run convert-csv-to-json.js first to create the movies.json file');
  process.exit(1);
}

const movies = JSON.parse(fs.readFileSync(MOVIES_JSON, 'utf8'));

console.log(`📖 Loaded ${movies.length} movies\n`);

function fetchFromOMDb(title, year) {
  return new Promise((resolve) => {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${OMDB_API_KEY}`;
    
    // Use https for secure connection (OMDb supports both http and https)
    const secureUrl = url.replace('http://', 'https://');
    const urlObj = new URL(secureUrl);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.Response === 'True' && response.Poster && response.Poster !== 'N/A') {
            resolve(response.Poster);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.warn(`\n⚠️  Error parsing response for "${title}":`, error.message);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.warn(`\n⚠️  Error fetching "${title}":`, error.message);
      resolve(null);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.warn(`\n⚠️  Timeout fetching "${title}"`);
      resolve(null);
    });

    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enrichMovies() {
  const enriched = [];
  let successCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  console.log('🖼️  Starting poster fetch...\n');

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    
    const displayTitle = movie.title.substring(0, 40).padEnd(40);
    process.stdout.write(`\r🎬 ${i + 1}/${movies.length}: ${displayTitle} `);
    
    // Only fetch if posterPath is null or empty
    if (!movie.posterPath || movie.posterPath === null) {
      const poster = await fetchFromOMDb(movie.title, movie.year);
      
      if (poster) {
        movie.posterPath = poster;
        // OMDb doesn't have backdrops, but we can use poster as fallback
        if (!movie.backdropPath || movie.backdropPath === null) {
          movie.backdropPath = poster;
        }
        successCount++;
      } else {
        failedCount++;
      }
    } else {
      // Already has poster, skip
      process.stdout.write('(already has poster)');
    }
    
    enriched.push(movie);
    
    // Rate limiting: OMDb free tier allows 1000 requests per day
    // Wait 200ms between requests to be respectful
    if (i < movies.length - 1) {
      await delay(200);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Completed in ${totalTime}s`);
  console.log(`   Success: ${successCount} posters fetched`);
  console.log(`   Failed: ${failedCount} movies`);
  console.log(`   Skipped: ${movies.length - successCount - failedCount} (already had posters)\n`);
  
  // Create backup
  const backupPath = MOVIES_JSON.replace('.json', '.backup.json');
  fs.copyFileSync(MOVIES_JSON, backupPath);
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  
  // Save updated movies
  fs.writeFileSync(MOVIES_JSON, JSON.stringify(enriched, null, 2));
  console.log(`💾 Updated: ${path.basename(MOVIES_JSON)}\n`);
  
  console.log('✨ Done! Restart your dev server to see the new posters.\n');
}

enrichMovies().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

