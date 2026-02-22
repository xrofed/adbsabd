// models/User.js
const mongoose = require('mongoose');

// 1. Buat Schema untuk History
const historySchema = new mongoose.Schema({
    type: String, // Contoh: 'manga', 'manhwa'
    slug: String,
    title: String,
    thumb: String,
    lastChapterTitle: String,
    lastChapterSlug: String,
    lastRead: { type: Date, default: Date.now }
});

// 2. Buat Schema untuk Library
const librarySchema = new mongoose.Schema({
    slug: { type: String, required: true },
    
    // Karena di Flutter kamu menggunakan manga.toJson(), 
    // kamu bisa menggunakan tipe Mixed untuk menyimpan object JSON yang dinamis,
    // atau kamu bisa mendefinisikan field spesifik seperti title, thumb, dll.
    mangaData: { type: mongoose.Schema.Types.Mixed }, 
    
    addedAt: { type: Date, default: Date.now }
});

// 3. Schema User Utama
const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    displayName: String,
    isPremium: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
    lastDownloadDate: { type: Date, default: Date.now },
    
    // 4. Masukkan History dan Library sebagai Array ke dalam User
    history: [historySchema],
    library: [librarySchema]
});

// Jangan lupa export modelnya agar bisa dipakai di file lain
module.exports = mongoose.model('User', userSchema);
