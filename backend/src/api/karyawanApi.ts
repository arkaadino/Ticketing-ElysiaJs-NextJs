import { Karyawan, KaryawanEntity } from "../models/karyawan";
import sequelize from "../config/db";
import { Elysia } from "elysia";
import { z } from "zod";

const app = new Elysia();

// GET - Ambil semua karyawan
app.get("/master/karyawan", async () => {
  try {
    console.log("📥 Menjalankan query untuk mengambil semua karyawan...");

    if (!sequelize.isDefined("Karyawan")) {
      throw new Error("Model Karyawan belum terinisialisasi!");
    }

    const karyawan = await Karyawan.findAll({
      attributes: { exclude: ["password"] }, // Hindari mengembalikan password
    });

    console.log("✅ Query berhasil, hasil:", karyawan);

    if (karyawan.length === 0) {
      return {
        code: 404,
        message: "Data karyawan tidak dapat ditemukan",
      };
    }
    return {
      code: 200,
      message: "Data karyawan ditemukan",
      data: karyawan,
    };
  } catch (error) {
    console.error("❌ Error saat mengambil data:", error);
    return {
      code: 500,
      message: "Data karyawan tidak dapat ditemukan",
    };
  }
});

// Validasi input untuk menambahkan karyawan baru
const KaryawanSchema = z.object({
  nik: z.number().min(1, "NIK tidak boleh kosong"),
  name: z.string().min(1, "Nama karyawan tidak boleh kosong").trim(),
  position: z.string().min(1, "Posisi tidak boleh kosong").trim(),
  unit_kerja: z.string().min(1, "Unit kerja tidak boleh kosong").trim(),
  job_title: z.string().min(1, "Jabatan tidak boleh kosong").trim(),
  role: z.enum(["admin", "employee"]),
  password: z.string().min(6, "Password minimal 6 karakter"), // Tambahkan password
  is_active: z.number().min(1, "Status tidak boleh kosong"),
});

// POST - Tambah karyawan baru
app.post("/master/karyawan", async ({ error, body }) => {
  try {
    const parsed = KaryawanSchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    // Hash password sebelum disimpan
    parsed.data.password = await Bun.password.hash(parsed.data.password);

    const karyawan = await Karyawan.create(parsed.data);

    return {
      code: 200,
      message: "Data karyawan berhasil ditambahkan",
      data: { ...karyawan.toJSON(), password: undefined }, // Jangan kembalikan password
    };
  } catch (err) {
    console.error("❌ Error saat menambahkan karyawan:", err);
    return error(500, { message: "Terjadi kesalahan pada server" });
  }
});

// Validasi input untuk update data karyawan
const KaryawanUpdateSchema = z.object({
  name: z.string().min(1, "Nama karyawan tidak boleh kosong").trim(),
  position: z.string().min(1, "Posisi tidak boleh kosong").trim(),
  unit_kerja: z.string().min(1, "Unit kerja tidak boleh kosong").trim(),
  job_title: z.string().min(1, "Jabatan tidak boleh kosong").trim(),
  role: z.enum(["admin", "employee"]).optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  is_active: z.number().min(1, "Status tidak boleh kosong"),
});

// PATCH - Edit data karyawan
app.patch("/master/karyawan/:id", async ({ error, body, params }) => {
  try {
    const parsed = KaryawanUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    const karyawan = await Karyawan.findByPk(params.id);
    if (!karyawan) {
      return error(404, "Karyawan tidak ditemukan");
    }

    // Jika password diupdate, hash terlebih dahulu
    if (parsed.data.password) {
      parsed.data.password = await Bun.password.hash(parsed.data.password);
    }

    // Update karyawan data
    await karyawan.update(parsed.data);

    return {
      code: 200,
      message: "Data karyawan berhasil diperbarui",
      data: { ...karyawan.toJSON(), password: undefined }, // Jangan kembalikan password
    };
  } catch (error) {
    console.error("❌ Error saat mengedit data karyawan:", error);
    return {
      code: 500,
      message: "Gagal mengedit data karyawan",
    };
  }
});

// SOFT DELETE - Hapus data karyawan
app.delete("/master/karyawan/:id", async ({ error, params }) => {
  try {
    const karyawan = await Karyawan.findByPk(params.id);
    if (!karyawan) {
      return error(404, "Karyawan tidak ditemukan");
    }

    // Soft delete dengan mengupdate deleted_at
    karyawan.deleted_at = new Date();
    await karyawan.save();

    return {
      code: 200,
      message: "Data karyawan berhasil dihapus (soft delete)",
      data: karyawan,
    };
  } catch (error) {
    console.error("❌ Error saat menghapus data karyawan:", error);
    return {
      code: 500,
      message: "Gagal menghapus data karyawan",
    };
  }
});

export default app;
