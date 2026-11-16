const mongoose = require('mongoose');
const env = require('./env');

// Prevent Mongoose from hanging queries indefinitely when DB is not running
mongoose.set('bufferTimeoutMS', 1500);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[SANAD-DB] Connecté à MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[SANAD-DB] Attention: Impossible de se connecter à MongoDB (${error.message}).`);
    console.warn('[SANAD-DB] Le serveur fonctionnera avec les données juridiques intégrées (Fallback In-Memory).');
    isConnected = false;
  }
};

const getStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : 'in-memory-fallback',
  uri: env.MONGODB_URI
});

module.exports = { connectDB, getStatus };
