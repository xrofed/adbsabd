require('dotenv').config({
  debug: false, quiet: true
});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Model (dibiarkan sesuai request, meski tidak dipakai langsung di sini)
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
// Middleware untuk parsing body request
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Middleware Static Files
// Melayani file di folder 'public' (css, js, gambar, index.html)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RUTE API (Prioritas Utama)
// ==========================================
// Semua request yang diawali '/api' masuk ke sini
app.use('/api', apiRoutes);

// ------------------------------------------
// 1. ERROR HANDLING KHUSUS API (404 JSON)
// ------------------------------------------
// Menangani jika user mengakses endpoint API yang TIDAK ADA.
// Contoh: /api/ngawur -> Return JSON 404 (Aman untuk Flutter).
// CATATAN: Jangan pakai '/api/*' agar tidak kena PathError di Express baru.
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
// Menangani semua rute lain yang bukan API dan bukan file statis.
// Mengirimkan index.html agar Frontend (Single Page App) yang menangani routing.
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
    // Koneksi ke Database
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('Successfully connected to MongoDB...');

    // Jalankan Server
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
