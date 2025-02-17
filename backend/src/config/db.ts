import { Sequelize } from "sequelize-typescript";
import dbConfig from "./config"; // Pastikan file ini ada

import { Status } from "../models/statuses";
import { Category } from "../models/categories";
import { Karyawan } from "../models/karyawan";
import { Priority } from "../models/priority";
import { Ticketing } from "../models/ticketing";

const env = (process.env.NODE_ENV || "development") as keyof typeof dbConfig;
const config = dbConfig[env];

const sequelize = new Sequelize({
    dialect: config.dialect,
    host: config.host,
    username: config.username,
    password: config.password || undefined,
    database: config.database,
    models: [Status, Category, Priority, Karyawan, Ticketing], // Load model sebelum relasi dipanggil
    logging: console.log, // Bisa dinonaktifkan di production
});

function setupAssociations() {
    Karyawan.hasMany(Ticketing, { foreignKey: "id_karyawans" });
    Ticketing.belongsTo(Karyawan, { foreignKey: "id_karyawans" });

    Status.hasMany(Ticketing, { foreignKey: "id_statuses" });
    Ticketing.belongsTo(Status, { foreignKey: "id_statuses" });

    Category.hasMany(Ticketing, { foreignKey: "id_categories" });
    Ticketing.belongsTo(Category, { foreignKey: "id_categories" });

    Priority.hasMany(Karyawan, { foreignKey: "id_priorities" });
    Karyawan.belongsTo(Priority, { foreignKey: "id_priorities" });
}

// Panggil relasi setelah Sequelize mengenali model
setupAssociations();

Karyawan.beforeSave(async (instance: Karyawan) => {
    if (instance.role === "admin" && instance.password) {
        instance.password = await Bun.password.hash(instance.password);
    }
});


export async function connectAndSyncDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Koneksi database berhasil");

        await sequelize.sync();
        console.log("✅ Sinkronisasi model berhasil");

    } catch (error) {
        console.error("❌ Gagal menghubungkan atau menyinkronkan database:", error);
    }
}

//kalau mau ganti alter table
//await sequelize.sync({alter:true})
//await sequelize.sync({force:true})

export default sequelize;
