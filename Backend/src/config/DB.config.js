import mongoose from 'mongoose';

const DB_CLIENT = process.env.DB_CLIENT || 'json';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miapp';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
}
