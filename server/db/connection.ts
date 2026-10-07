import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[DB] No MONGODB_URI detected in environment. Running in high-performance in-memory repository mode.');
    return false;
  }

  try {
    console.log('[DB] Attempting connection to MongoDB URI...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[DB] Successfully connected to MongoDB via Mongoose!');
    return true;
  } catch (error) {
    console.warn('[DB] MongoDB connection failed or timed out. Falling back gracefully to memory store.', (error as Error).message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
