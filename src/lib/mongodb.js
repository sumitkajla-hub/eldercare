// MongoDB connection utility - Singleton pattern
// Uses MongoDB Memory Server in development if no real URI is configured
// In production (Vercel), requires a real MONGODB_URI (e.g. MongoDB Atlas)
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function isLocalhostURI(uri) {
  if (!uri) return false;
  return (
    uri.includes('127.0.0.1') ||
    uri.includes('localhost') ||
    uri.includes('0.0.0.0')
  );
}

async function getMongoURI() {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

  // In production, we must have a real (non-localhost) URI
  if (isProduction) {
    if (!uri || uri.includes('your-connection-string')) {
      throw new Error(
        'MONGODB_URI environment variable is not configured. ' +
        'Please set MONGODB_URI to a MongoDB Atlas connection string in your Vercel project settings. ' +
        'Get a free cluster at https://mongodb.com/atlas'
      );
    }

    if (isLocalhostURI(uri)) {
      throw new Error(
        'MONGODB_URI is pointing to localhost which is not accessible in production. ' +
        'Please update MONGODB_URI in your Vercel project settings to a MongoDB Atlas connection string. ' +
        'Get a free cluster at https://mongodb.com/atlas'
      );
    }

    return uri;
  }

  // In development, if a real URI is set (not placeholder, not localhost), use it
  if (uri && !uri.includes('your-connection-string')) {
    return uri;
  }

  // In development, fall back to MongoDB Memory Server
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');

    if (!global._mongoMemoryServer) {
      global._mongoMemoryServer = await MongoMemoryServer.create();
      console.log('🧪 Started MongoDB Memory Server for development');
    }

    return global._mongoMemoryServer.getUri();
  } catch (err) {
    // If memory server fails and we have a localhost URI, try that
    if (uri && isLocalhostURI(uri)) {
      console.log('⚠️ MongoDB Memory Server failed, falling back to local MongoDB at', uri);
      return uri;
    }
    throw new Error(
      'Failed to start MongoDB Memory Server and no MONGODB_URI is configured. ' +
      'Either install MongoDB locally or set MONGODB_URI in .env.local'
    );
  }
}

async function connectDB() {
  if (cached.conn) {
    // Verify the connection is still alive
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // Connection dropped, reset cache
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const uri = await getMongoURI();
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
      connectTimeoutMS: 10000,         // 10s timeout for initial connection
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;

    // Provide a friendlier error message for common connection issues
    if (e.message && e.message.includes('ECONNREFUSED')) {
      throw new Error(
        'Could not connect to MongoDB. The database server is not running or not reachable. ' +
        'If running locally, make sure MongoDB is started. ' +
        'If deployed, set MONGODB_URI to your MongoDB Atlas connection string.'
      );
    }

    throw e;
  }

  return cached.conn;
}

export default connectDB;
