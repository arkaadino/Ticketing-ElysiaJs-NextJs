import sequelize from "../config/db";
// Fungsi untuk mengecek koneksi ke database
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database berhasil terkoneksi!");
  } catch (error) {
    console.error("❌ Gagal terkoneksi ke database:", error);
  }
}

// Fungsi untuk melihat semua tabel
async function listTables() {
  try {
    const [results] = await sequelize.query("SHOW TABLES;");
    console.log("📋 Daftar Tabel:", results);
  } catch (error) {
    console.error("❌ Gagal mengambil daftar tabel:", error);
  }
}

// Jalankan fungsi di sini
checkConnection().then(() => listTables());
