// MongoDB connection utility - Singleton pattern
// Uses MongoDB Memory Server in development if no real URI is configured
// In production (Vercel), requires a real MONGODB_URI
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function getMongoURI() {
  const uri = process.env.MONGODB_URI;

  // If a real MongoDB URI is set (not placeholder), use it
  if (uri && !uri.includes('your-connection-string')) {
    return uri;
  }

  // In production, we must have a real URI
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error(
      'MONGODB_URI must be set to a real MongoDB connection string in production. ' +
      'Get a free cluster at https://mongodb.com/atlas'
    );
  }

  // In development, use MongoDB Memory Server
  const { MongoMemoryServer } = await import('mongodb-memory-server');

  if (!global._mongoMemoryServer) {
    global._mongoMemoryServer = await MongoMemoryServer.create();
    console.log('🧪 Started MongoDB Memory Server for development');
  }

  return global._mongoMemoryServer.getUri();
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = await getMongoURI();
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
