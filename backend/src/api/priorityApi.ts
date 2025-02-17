import { Priority } from "../models/priority";
import sequelize from "../config/db";
import { Elysia } from "elysia";
import { z } from "zod";

const app = new Elysia();

// GET - Ambil semua priority
app.get("/master/priority", async ({error}) => {
  try {
    console.log("📥 Menjalankan query untuk mengambil semua priority...");

    if (!sequelize.isDefined("Priority")) {
      throw new Error("Model Priority belum terinisialisasi!");
    }

    const priorities = await Priority.findAll();

    console.log("✅ Query berhasil, hasil:", priorities);

    if (priorities.length === 0) {
      return {
        code: 404,
        message: "Data priority tidak dapat ditemukan",
      };
    }
    return {
      code: 200,
      message: "Data priority ditemukan",
      data: priorities,
    };
  } catch (err) {
    console.error("❌ Error saat menambahkan tiket:", err);
    return error(500, { message: "Terjadi kesalahan pada server" });
}
});

// Validasi input untuk menambahkan priority baru
const PrioritySchema = z.object({
  sla: z.number().min(1, "SLA tidak boleh kosong"),
  level: z.number().min(1, "Level tidak boleh kosong"),
  is_active: z.number().min(1, "Status tidak boleh kosong"),
});

// POST - Tambah priority baru
app.post("/master/priority", async ({ error, body }) => {
  try {
    const parsed = PrioritySchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    const priority = await Priority.create(parsed.data);

    return {
      code: 200,
      message: "Data priority berhasil ditambahkan",
      data: priority,
    };
  } catch (error) {
    console.error("❌ Error saat menambahkan data priority:", error);
    return {
      code: 500,
      message: "Gagal menambahkan data priority",
    };
  }
});

// Validasi input untuk update data priority
const PriorityUpdateSchema = z.object({
  sla: z.number().min(1, "SLA tidak boleh kosong"),
  level: z.number().min(1, "Level tidak boleh kosong"),
  is_active: z.number().min(1, "Status tidak boleh kosong"),
});

// PATCH - Edit data priority
app.patch("/master/priority/:id", async ({ error, body, params }) => {
  try {
    const parsed = PriorityUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    const priority = await Priority.findByPk(params.id);
    if (!priority) {
      return error(404, "Priority tidak ditemukan");
    }

    await priority.update(parsed.data);

    return {
      code: 200,
      message: "Data priority berhasil diperbarui",
      data: priority,
    };
  } catch (error) {
    console.error("❌ Error saat mengedit data priority:", error);
    return {
      code: 500,
      message: "Gagal mengedit data priority",
    };
  }
});

// SOFT DELETE - Hapus data priority
app.delete("/master/priority/:id", async ({ error, params }) => {
  try {
    const priority = await Priority.findByPk(params.id);
    if (!priority) {
      return error(404, "Priority tidak ditemukan");
    }

    priority.deleted_at = new Date();
    await priority.save();

    return {
      code: 200,
      message: "Data priority berhasil dihapus (soft delete)",
      data: priority,
    };
  } catch (error) {
    console.error("❌ Error saat menghapus data priority:", error);
    return {
      code: 500,
      message: "Gagal menghapus data priority",
    };
  }
});

export default app;
