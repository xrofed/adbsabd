require('dotenv').config({
  debug: false, quiet: true
});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Model (dibiarkan sesuai request)
const Manga = require('./models/Manga'); 
const Chapter = require('./models/Chapter');

// IMPORT RUTE API
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const WEBSITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Folder Public (index.html ada di sini)
// express.static akan otomatis melayani index.html jika user membuka root '/'
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RUTE API (Prioritas Tinggi)
// ==========================================
// Pastikan API didefinisikan SEBELUM catch-all route
app.use('/api', apiRoutes);

// ------------------------------------------
// 1. ERROR HANDLING KHUSUS API (404 JSON)
// ------------------------------------------
// Jika user akses /api/ngawur, jangan kasih HTML, tapi kasih JSON error.
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    status: 404
  });
});

// ------------------------------------------
// 2. ERROR HANDLING UNTUK WEB (SPA Fallback)
// ------------------------------------------
// Jika rute tidak ditemukan di atas (bukan API & bukan file statis),
// kirimkan file index.html dari folder public.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// SERVER STARTUP
// ==========================================
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("FATAL ERROR: DB_URI is not defined in environment variables.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('Successfully connected to MongoDB...');

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      console.log(`Access at: ${WEBSITE_URL}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB. Server will not start.', err);
    process.exit(1);
  }
};

startServer();
