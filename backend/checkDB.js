require("dotenv").config();
const mongoose = require("mongoose");

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log("Databases:", dbs.databases.map(db => db.name));
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections in current DB:", collections.map(c => c.name));
  
  await mongoose.disconnect();
}
checkDB().catch(console.error);
