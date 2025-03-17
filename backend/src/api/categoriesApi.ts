import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Category } from "../models/categories";

const categoriesApi = new Elysia({ prefix: "/categories" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah kategori baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.name || body.name.trim() === "") {
        errors.name = "Field name harus diisi dan tidak boleh kosong";
      }

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal menambahkan kategori, periksa input!", errors };
      }

      const newCategory = await Category.create(body);
      set.status = 200;
      return { success: true, message: "Kategori berhasil ditambahkan", data: newCategory };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

  // GET - Ambil semua categories
  .get("/", async ({ set }: { set: any }) => {
    try {
      const categoryList = await Category.findAll({where: {is_active: 1}});
      if (categoryList.length === 0) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data kategori ditemukan", data: categoryList };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data kategori" };
    }
  })

  // GET - Ambil category berdasarkan ID
  .get("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const category = await Category.findByPk(params.id);
      if (!category) {
        set.status = 400;
        return { success: false, message: "Kategori tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data kategori ditemukan", data: category };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data kategori" };
    }
  })

  // PATCH - Update category
  .patch("/:id", async ({ params, body, set }: { params: { id: string }, body: any, set: any }) => {
    try {
      const category = await Category.findByPk(params.id);
      if (!category) {
        set.status = 400;
        return { success: false, message: "Kategori tidak ditemukan" };
      }

      // Allow name to be optional
      if (body.name && body.name.trim() === "") {
        return { success: false, message: "Field name tidak boleh kosong" };
      }

      await category.update(body);
      set.status = 200;
      return { success: true, message: "Kategori berhasil diperbarui", data: category };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal memperbarui kategori" };
    }
  })

  // DELETE - Hapus category
  .delete("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const category = await Category.findByPk(params.id);
      if (!category) {
        set.status = 400;
        return { success: false, message: "Kategori tidak ditemukan" };
      }
      await category.destroy();
      set.status = 200;
      return { success: true, message: "Kategori berhasil dihapus" };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal menghapus kategori" };
    }
  });

export default categoriesApi;
