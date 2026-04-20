const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Movie = require('./models/movieModel');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const frontEndAssets = path.join(__dirname, '../front-end/src/assets');

// Helper to convert "2h 20m" to number of minutes
function parseDuration(str) {
  if (!str) return 0;
  const hMatch = str.match(/(\d+)h/);
  const mMatch = str.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1])*60 : 0;
  const m = mMatch ? parseInt(mMatch[1]) : 0;
  return h + m;
}

// Convert fake ES6 export file to valid JSON arrays by executing it manually via regex substitution
function extractDataFromJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let mappings = {};

  // Find all imports: import M1 from "../assets/M1.png"
  const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
      let varName = match[1];
      let relPath = match[2]; // e.g. "../assets/M1.png"
      let baseName = path.basename(relPath);
      mappings[varName] = `uploads/${baseName}`;
      
      // Copy physical file
      let sourcePath = path.join(frontEndAssets, baseName);
      let destPath = path.join(uploadsDir, baseName);
      if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
          fs.copyFileSync(sourcePath, destPath);
      }
  }

  // Remove imports 
  content = content.replace(/import\s+[A-Za-z0-9_]+\s+from\s+["'][^"']+["'];?/g, '');
  
  // Create mock variables for the script to execute cleanly
  let mockVars = "";
  for (let key in mappings) {
      mockVars += `const ${key} = "${mappings[key]}";\n`;
  }
  
  // Transform ES syntax for Node Eval
  content = content.replace(/export\s+default\s+([A-Za-z0-9_]+);?/, 'module.exports = $1;');
  content = content.replace(/export\s+const\s+([A-Za-z0-9_]+)/g, 'module.exports.$1');

  // Eval!
  let module = { exports: {} };
  try {
      eval(mockVars + content);
  } catch (e) {
      console.error("Eval failed for", filePath, e);
  }
  return module.exports;
}

// Map slots structurally
function mapSlots(slots) {
   if (!slots) return [];
   return slots.map((s, i) => {
       const d = new Date(s.time);
       return {
           id: "slot_" + i + "_" + Date.now().toString(36),
           date: d.toISOString().split("T")[0],
           time: d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true }),
           ampm: d.getHours() >= 12 ? 'PM' : 'AM',
           bookedSeats: [],
       };
   });
}

function mapDummyToMovie(dummy, type) {
   return {
       title: dummy.title,
       description: dummy.synopsis || "",
       duration: parseDuration(dummy.duration),
       category: [dummy.category || dummy.genre || ""],
       posterUrl: dummy.img || dummy.image || "",
       trailerUrl: dummy.trailer || "",
       rating: parseFloat(dummy.rating) || 7.5,
       type: type,
       seatPrices: { standard: dummy.price || 150, recliner: (dummy.price || 150) + 100 },
       auditorium: "Audi 1",
       cast: (dummy.cast || []).map(c => ({ name: c.name, role: c.role, avatarUrl: c.img })),
       directors: Array.isArray(dummy.director) 
          ? dummy.director.map(d => ({ name: d.name, avatarUrl: d.img })) 
          : (dummy.director ? [{ name: dummy.director.name, avatarUrl: dummy.director.img }] : []),
       producers: Array.isArray(dummy.producer) 
          ? dummy.producer.map(p => ({ name: p.name, avatarUrl: p.img })) 
          : (dummy.producer ? [{ name: dummy.producer.name, avatarUrl: dummy.producer.img }] : []),
       showtimes: mapSlots(dummy.slots)
   };
}

async function runSeeder() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-movie-app");
  
  console.log("Extracting Featured dummy films...");
  const featuredData = extractDataFromJs(path.join(__dirname, '../front-end/src/assets/dummymoviedata.js'));
  
  console.log("Extracting Normal dummy films...");
  const normalDataObj = extractDataFromJs(path.join(__dirname, '../front-end/src/assets/dummymdata.js'));
  const normalData = [];
  for (let key in normalDataObj) {
      if (Array.isArray(normalDataObj[key])) {
          normalData.push(...normalDataObj[key]);
      }
  }

  let count = 0;

  for (let d of featuredData) {
      const exists = await Movie.findOne({ title: d.title });
      if (!exists) {
          await Movie.create(mapDummyToMovie(d, "featured"));
          count++;
          console.log("Inserted featured: " + d.title);
      }
  }

  for (let d of normalData) {
      const exists = await Movie.findOne({ title: d.title });
      if (!exists) {
           await Movie.create(mapDummyToMovie(d, "normal"));
           count++;
           console.log("Inserted normal: " + d.title);
      }
  }

  console.log('✅ Seeded Movie Database! Inserted: ', count);
  mongoose.connection.close();
}

runSeeder();
