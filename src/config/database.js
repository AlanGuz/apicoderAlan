// src/config/database.js
require("dotenv").config();
const mongoose = require('mongoose');

async function connectDB(uri) {
    try {
        console.log("Intentando conectar a MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ Conectado a MongoDB");
    } catch (err) {
        console.error("❌ Error conectando a MongoDB:", err);
        process.exit(1);
    }
}

module.exports = connectDB;



