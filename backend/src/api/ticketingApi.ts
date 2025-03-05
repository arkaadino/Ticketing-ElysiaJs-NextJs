import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Ticketing } from "../models/ticketing";
import { Priority } from "../models/priority";
import { Category } from "../models/categories";
import { Status } from "../models/statuses";

const ticketingApi = new Elysia({ prefix: "/master/ticketings" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah tiket baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.id_karyawans) errors.id_karyawans = "ID Karyawan harus diisi";
      if (!body.id_categories) {
        errors.id_categories = "ID Kategori harus dipilih";
      } else {
        const categoryExists = await Category.findOne({ where: { id: body.id_categories } });
        if (!categoryExists) {
          errors.id_categories = "Kategori tidak valid";
        }
      }
      if (!body.id_priorities) {
        errors.id_priorities = "Prioritas harus dipilih";
      } else {
        const priorityExists = await Priority.findOne({ where: { id: body.id_priorities } });
        if (!priorityExists) {
          errors.id_priorities = "Prioritas tidak valid";
        }
      }
      if (!body.id_statuses) {
        errors.id_statuses = "Status harus dipilih";
      } else {
        const statusExists = await Status.findOne({ where: { id: body.id_statuses } });
        if (!statusExists) {
          errors.id_statuses = "Status tidak valid";
        }
      }
      if (!body.keluhan?.trim()) errors.keluhan = "Keluhan harus diisi";
      if (!body.eskalasi?.trim()) errors.eskalasi = "Eskalasi harus diisi";
      if (!body.response?.trim()) errors.response = "Response harus diisi";
      if (!body.pending?.trim()) errors.pending = "Pending harus diisi";
      if (!body.analisa?.trim()) errors.analisa = "Analisa harus diisi";
      if (body.is_active === undefined) errors.is_active = "Status keaktifan harus diisi";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal menambahkan tiket, periksa input!", errors };
      }

      const newTicket = await Ticketing.create(body);
      set.status = 200;
      return { success: true, message: "Tiket berhasil ditambahkan", data: newTicket };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

  // GET - Ambil semua tiket
  .get("/", async ({ set }: { set: any }) => {
    try {
      const tickets = await Ticketing.findAll();
      if (!tickets.length) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data tiket ditemukan", data: tickets };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data tiket" };
    }
  })

  // GET - Ambil tiket berdasarkan ID
  .get("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticket = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticket) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data tiket ditemukan", data: ticket };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data tiket" };
    }
  })

  // PATCH - Update tiket
  .patch("/:id", async ({ params, body, set }: { params: any; body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};
      const ticket = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticket) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      if (!body.id_karyawans) errors.id_karyawans = "ID Karyawan harus diisi";
      if (!body.id_categories) {
        errors.id_categories = "ID Kategori harus dipilih";
      } else {
        const categoryExists = await Category.findOne({ where: { id: body.id_categories } });
        if (!categoryExists) {
          errors.id_categories = "Kategori tidak valid";
        }
      }
      if (!body.id_priorities) {
        errors.id_priorities = "Prioritas harus dipilih";
      } else {
        const priorityExists = await Priority.findOne({ where: { id: body.id_priorities } });
        if (!priorityExists) {
          errors.id_priorities = "Prioritas tidak valid";
        }
      }
      if (!body.id_statuses) {
        errors.id_statuses = "Status harus dipilih";
      } else {
        const statusExists = await Status.findOne({ where: { id: body.id_statuses } });
        if (!statusExists) {
          errors.id_statuses = "Status tidak valid";
        }
      }
      if (!body.keluhan?.trim()) errors.keluhan = "Keluhan harus diisi";
      if (!body.eskalasi?.trim()) errors.eskalasi = "Eskalasi harus diisi";
      if (!body.response?.trim()) errors.response = "Response harus diisi";
      if (!body.pending?.trim()) errors.pending = "Pending harus diisi";
      if (!body.analisa?.trim()) errors.analisa = "Analisa harus diisi";
      if (body.is_active === undefined) errors.is_active = "Status keaktifan harus diisi";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal memperbarui tiket, periksa input!", errors };
      }

      await ticket.update(body);
      set.status = 200;
      return { success: true, message: "Tiket berhasil diperbarui", data: ticket };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal memperbarui tiket" };
    }
  })

  // DELETE - Soft delete tiket
  .delete("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticket = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticket) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      await ticket.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Tiket berhasil dihapus (soft delete)" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal menghapus tiket" };
    }
  });

export default ticketingApi;
