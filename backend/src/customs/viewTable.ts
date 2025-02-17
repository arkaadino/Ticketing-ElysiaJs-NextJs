import sequelize from "../config/db";
import { Karyawan } from "../models/karyawan";

// Fungsi untuk menampilkan isi tabel secara dinamis
async function viewTable(tableName: string) {
    try {
      console.log(`📥 Mengambil data dari tabel ${tableName}...`);
      
      const [results] = await sequelize.query(`SELECT * FROM \`${tableName}\`;`);
      
      console.log(`📊 Isi Tabel ${tableName}:`, results);
    } catch (error) {
      console.error(`❌ Gagal mengambil isi tabel ${tableName}:`, error);
    }
  }
  
  // Ambil nama tabel dari argumen CLI
  const tableName = process.argv[2];
  
  if (!tableName) {
    console.error("❌ Harap masukkan nama tabel. Contoh: bun run viewTable.ts karyawan");
    process.exit(1);
  }
  
  viewTable(tableName);