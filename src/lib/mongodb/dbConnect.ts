import mongoose from "mongoose";
import dns from 'dns';


dns.setServers(['8.8.8.8', '8.8.4.4']);
const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 60000,
      heartbeatFrequencyMS: 10000,
      family: 4,
    };

    async function connectWithRetry(retries = 5, delay = 2000): Promise<typeof mongoose> {
      try {
        const conn = await mongoose.connect(MONGODB_URI, options);
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ MongoDB connected");
        }
        return conn;
      } catch (err) {
        console.log(err)
        if (retries <= 0) {
          console.error("❌ MongoDB connection failed:", err);
          throw err;
        }
        console.warn(`⚠️ MongoDB connection failed. Retrying in ${delay / 1000}s... (${retries} left)`);
        await new Promise(res => setTimeout(res, delay));
        return connectWithRetry(retries - 1, delay * 2); 
      }
    }

    cached.promise = connectWithRetry();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
