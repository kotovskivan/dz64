const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dz64_local';
mongoose.set('strictQuery', true);
async function connectDB() {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log('[MongoDB] connected');
}
module.exports = { connectDB };
