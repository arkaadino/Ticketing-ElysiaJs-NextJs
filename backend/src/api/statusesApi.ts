import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Status } from "../models/statuses";

const statusesApi = new Elysia({ prefix: "/statuses" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah status baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.name || body.name.trim() === "") {
        errors.name = "Field name harus diisi dan tidak boleh kosong";
      }

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal menambahkan status, periksa input!", errors };
      }

      const newStatus = await Status.create(body);
      set.status = 200;
      return { success: true, message: "Status berhasil ditambahkan", data: newStatus };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

  // GET - Ambil semua statuses
  .get("/", async ({ set }: { set: any }) => {
    try {
      const statusList = await Status.findAll({where: {is_active: 1}});
      if (statusList.length === 0) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data statuses ditemukan", data: statusList };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data statuses" };
    }
  })

  // GET - Ambil status berdasarkan ID
  .get("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const status = await Status.findByPk(params.id);
      if (!status) {
        set.status = 400;
        return { success: false, message: "Status tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data status ditemukan", data: status };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data status" };
    }
  })

  // PATCH - Update status
  .patch("/:id", async ({ params, body, set }: { params: { id: string }, body: any, set: any }) => {
    try {
      const status = await Status.findByPk(params.id);
      if (!status) {
        set.status = 400;
        return { success: false, message: "Status tidak ditemukan" };
      }

      // Allow name to be optional
      if (body.name && body.name.trim() === "") {
        return { success: false, message: "Field name tidak boleh kosong" };
      }


      await status.update(body);
      set.status = 200;
      return { success: true, message: "Status berhasil diperbarui", data: status };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal memperbarui status" };
    }
  })

  // DELETE - Hapus status
  .delete("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const status = await Status.findByPk(params.id);
      if (!status) {
        set.status = 400;
        return { success: false, message: "Status tidak ditemukan" };
      }
      await status.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Status berhasil dihapus" };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal menghapus status" };
    }
  });

export default statusesApi;
