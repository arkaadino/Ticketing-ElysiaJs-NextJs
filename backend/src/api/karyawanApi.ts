import { Karyawan } from "../models/karyawan";
import sequelize from "../config/db";
import { Elysia } from "elysia";
import { z } from "zod";

const app = new Elysia();

// GET - Ambil semua karyawan
app.get("/master/karyawan", async ({ error }) => {
  try {
    console.log("📥 Menjalankan query untuk mengambil semua karyawan...");

    if (!sequelize.isDefined("Karyawan")) {
      throw new Error("Model Karyawan belum terinisialisasi!");
    }

    const karyawan = await Karyawan.findAll({
      attributes: { exclude: ["password"] },
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
  } catch (err) {
    console.error("❌ Error saat mengambil data karyawan:", err);
    return error(500, { message: "Terjadi kesalahan pada server" });
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
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  is_active: z.number().min(1, "Status tidak boleh kosong"),
  id_priorities: z.number().min(1, "ID Priorities tidak boleh kosong"),
}).superRefine((data, ctx) => {
  if (data.role === "admin" && (!data.password || data.password.length < 6)) {
    ctx.addIssue({
      code: "custom",
      message: "Password harus diisi minimal 6 karakter untuk admin",
      path: ["password"],
    });
  }
  if (data.role === "employee" && data.password) {
    ctx.addIssue({
      code: "custom",
      message: "Employee tidak boleh memiliki password",
      path: ["password"],
    });
  }
});

// POST - Tambah karyawan baru
app.post("/master/karyawan", async ({ error, body }) => {
  try {
    const parsed = KaryawanSchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    if (parsed.data.role === "employee") {
      delete parsed.data.password;
    } else if (parsed.data.password) {
      parsed.data.password = await Bun.password.hash(parsed.data.password);
    }

    const karyawan = await Karyawan.create(parsed.data);

    return {
      code: 200,
      message: "Data karyawan berhasil ditambahkan",
      data: { ...karyawan.toJSON(), password: undefined },
    };
  } catch (err) {
    console.error("❌ Error saat menambahkan karyawan:", err);
    return error(500, { message: "Terjadi kesalahan pada server" });
  }
});

// Validasi input untuk update data karyawan
const KaryawanUpdateSchema = z.object({
  nik: z.number().optional(),
  name: z.string().optional(),
  position: z.string().optional(),
  unit_kerja: z.string().optional(),
  job_title: z.string().optional(),
  role: z.enum(["admin", "employee"]).optional(),
  password: z.string().min(6).optional(),
  is_active: z.number().optional(),
  id_priorities: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "admin" && data.password && data.password.length < 6) {
    ctx.addIssue({
      code: "custom",
      message: "Password minimal 6 karakter untuk admin",
      path: ["password"],
    });
  }
  if (data.role === "employee" && data.password) {
    ctx.addIssue({
      code: "custom",
      message: "Employee tidak boleh memiliki password",
      path: ["password"],
    });
  }
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

    if (parsed.data.role === "employee") {
      delete parsed.data.password;
    } else if (parsed.data.password) {
      parsed.data.password = await Bun.password.hash(parsed.data.password);
    }

    await karyawan.update(parsed.data);

    return {
      code: 200,
      message: "Data karyawan berhasil diperbarui",
      data: { ...karyawan.toJSON(), password: undefined },
    };
  } catch (err) {
    console.error("❌ Error saat mengedit data karyawan:", err);
    return error(500, { message: "Gagal mengedit data karyawan" });
  }
});

// SOFT DELETE - Hapus data karyawan
app.delete("/master/karyawan/:id", async ({ error, params }) => {
  try {
    const karyawan = await Karyawan.findByPk(params.id);
    if (!karyawan) {
      return error(400, "Karyawan tidak ditemukan");
    }

    karyawan.deleted_at = new Date();
    karyawan.is_active = 0;
    await karyawan.save();

    return {
      code: 200,
      message: "Data karyawan berhasil dihapus (soft delete)",
      data: karyawan,
    };
  } catch (err) {
    console.error("❌ Error saat menghapus data karyawan:", err);
    return error(500, { message: "Gagal menghapus data karyawan" });
  }
});

export default app;
