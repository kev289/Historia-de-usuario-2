import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, define la variable de entorno MONGODB_URI dentro de .env.local');
}

// Usamos 'any' para saltarnos las restricciones de tipos en el objeto global
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Si ya existe una conexión activa, la reutilizamos
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay promesa de conexión, la creamos
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      return m;
    });
  }

  // Esperamos a que la promesa se resuelva y guardamos la conexión
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;