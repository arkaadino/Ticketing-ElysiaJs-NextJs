import { Category, CategoriesEntity } from "../models/categories";
import sequelize from "../config/db";
import { Elysia, } from "elysia";
import { z } from "zod";

const app = new Elysia();


app.get("/master/categories", async ({error}) => {
  try {
    console.log("📥 Menjalankan query untuk mengambil kategori...");

    const category = await Category.findAll({
      where: {
        is_active: 1,
      },
    });

    console.log("✅ Query berhasil, hasil:", category);

    if (category.length === 0){
      return {
        code: 400,
        message: "Data categories tidak dapat ditemukan",
      };  
    }
    return {
      code: 200,
      message: "Data categories ditemukan",
      data: category,
    };
  } catch (err) {
    console.error("❌ Error saat menambahkan tiket:", err);
    return error(500, { message: "Terjadi kesalahan pada server" });
}
});


// Definisikan tipe untuk body request

const CategorySchema = z.object({
  name: z.string()
    .trim() // Hapus spasi di awal & akhir
    .min(1, "Nama kategori tidak boleh kosong atau hanya berisi spasi"),
  is_active: z.number(),
});

app.post("/master/categories", async ({ error, body }) => {
  try {
    // Validasi request body
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    const category = await Category.create(parsed.data);
    
    return {
      code: 200,
      message: "Kategori berhasil ditambahkan",
      data: category,
    };
  } catch (error) {
    console.error("❌ Error saat menambahkan kategori:", error);
    return {
      code: 500,
      message: "Gagal menambahkan kategori",
    };
  }
});


// PATCH - Edit Category
const CategoryUpdateSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Nama kategori tidak boleh kosong atau hanya berisi spasi")
    .optional(),
  is_active: z.number().optional(),
});

app.patch("/master/categories/:id", async ({ error, params, body }) => {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return error(400, "ID kategori tidak valid");

    const category = await Category.findByPk(id);
    if (!category) return error(404, "Kategori tidak ditemukan");

    // Validasi data yang akan di-update
    const parsed = CategoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return error(400, parsed.error.errors);
    }

    await category.update(parsed.data);

    return {
      code: 200,
      message: "Kategori berhasil diperbarui",
      data: category,
    };
  } catch (error) {
    console.error("❌ Error saat mengupdate kategori:", error);
    return {
      code: 500,
      message: "Gagal mengupdate kategori",
    };
  }
});

// SOFT DELETE - Hapus Status

// SOFT DELETE - Hapus Category
app.delete("/master/categories/:id", async ({error, params}) => {
  try {
    const id = params.id; // Ambil ID dari parameter URL

    // Validasi ID
    const category = await Category.findByPk(id);
    if (!category) {
      return error(400, "Id tidak dapat ditemukan!");
    }

    // Soft delete dengan mengisi deleted_at
    category.deleted_at = new Date();
    category.is_active = 0;
    await category.save();

    return {
      code: 200,
      message: "Data category berhasil dihapus (soft delete)",
      data: category,
    };
  } catch (error) {
    console.error("❌ Error saat menghapus data category:", error);
    return {
      code: 500,
      message: "Gagal menghapus data category",
    };
  }
});

export default app;