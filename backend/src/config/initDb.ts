import { Sequelize } from "sequelize";
import sequelize from "./db"; // Impor koneksi database dari config utama
import dbConfig from "./config"; // Impor konfigurasi database

const env = (process.env.NODE_ENV || "development") as keyof typeof dbConfig;
const config = dbConfig[env];

// Koneksi sementara tanpa database untuk membuat database baru
const sequelizeRoot = new Sequelize("", config.username, config.password || undefined, {
    host: config.host,
    dialect: config.dialect,
});

// Fungsi untuk membuat database jika belum ada
async function createDatabase() {
    try {
        await sequelizeRoot.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
        console.log(`✅ Database '${config.database}' siap!`);

        // Reconnect ke database utama
        await sequelize.authenticate();

        // Sinkronisasi semua model (Buat tabel sesuai model)
        await sequelize.sync({ force: true }); // Bisa ganti jadi force: true kalau mau reset semua tabel
        console.log("✅ Semua tabel sudah dibuat atau diperbarui!");

        process.exit();
    } catch (error) {
        console.error("❌ Gagal membuat database:", error);
        process.exit(1);
    }
}

createDatabase();
