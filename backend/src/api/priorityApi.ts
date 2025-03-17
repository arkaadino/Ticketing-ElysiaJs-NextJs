import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Priority } from "../models/priority";

const priorityApi = new Elysia({ prefix: "/priority" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah priority baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.sla) {
        errors.sla = "Field sla harus diisi dan tidak boleh kosong";
      }

      if (!body.level) {
        errors.level = "Field level harus diisi dan tidak boleh kosong";
      }

      if (!body.is_active || ![1, 0].includes(body.is_active)) errors.is_active = "Status keaktifan harus diisi";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal menambahkan priority, periksa input!", errors };
      }

      const newPriority = await Priority.create(body);
      set.status = 200;
      return { success: true, message: "Priority berhasil ditambahkan", data: newPriority };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

  // GET - Ambil semua priorities
  .get("/", async ({ set }: { set: any }) => {
    try {
      const priorityList = await Priority.findAll({where: {is_active: 1}});
      if (priorityList.length === 0) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data priorities ditemukan", data: priorityList };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data priorities" };
    }
  })

  // GET - Ambil priority berdasarkan ID
  .get("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const priority = await Priority.findByPk(params.id);
      if (!priority) {
        set.status = 400;
        return { success: false, message: "Priority tidak ditemukan" };
      }
      set.status = 200;
      return { success: true, message: "Data priority ditemukan", data: priority };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal mengambil data priority" };
    }
  })

  // PATCH - Update priority
  .patch("/:id", async ({ params, body, set }: { params: { id: string }, body: any, set: any }) => {
    try {
      const priority = await Priority.findByPk(params.id);
      if (!priority) {
        set.status = 400;
        return { success: false, message: "Priority tidak ditemukan" };
      }

      // Allow name to be optional
      if (body.name && body.name.trim() === "") {
        return { success: false, message: "Field name tidak boleh kosong" };
      }


      await priority.update(body);
      set.status = 200;
      return { success: true, message: "Priority berhasil diperbarui", data: priority };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal memperbarui priority" };
    }
  })

  // DELETE - Hapus priority
  .delete("/:id", async ({ params, set }: { params: { id: string }, set: any }) => {
    try {
      const priority = await Priority.findByPk(params.id);
      if (!priority) {
        set.status = 400;
        return { success: false, message: "Priority tidak ditemukan" };
      }
      await priority.destroy();
      set.status = 200;
      return { success: true, message: "Priority berhasil dihapus" };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Gagal menghapus priority" };
    }
  });

export default priorityApi;
