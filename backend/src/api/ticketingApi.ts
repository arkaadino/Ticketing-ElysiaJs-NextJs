import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Ticketing } from "../models/ticketing";
import { Priority } from "../models/priority";
import { Category } from "../models/categories";
import { Status } from "../models/statuses";
import { Karyawan } from "../models/karyawan";

const ticketingApi = new Elysia({ prefix: "/ticketings" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah tiket baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {}; // Declare errors object

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
      const ticketingList = await Ticketing.findAll({
        where: {is_active: 1},
        include: [         
          {
            model: Karyawan,
            attributes: ["id", "name"]
          },
          {
            model: Category,
            attributes: ["id", "name"]
          },
          {
            model: Status,
            attributes: ["id", "name"]
          }
        ],
      });
      if (!ticketingList.length) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data tiket ditemukan", data: ticketingList };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data tiket" };
    }
  })

  // GET - Ambil tiket berdasarkan ID
  .get("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data tiket ditemukan", data: ticketing };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data tiket" };
    }
  })

  // PATCH - Update tiket
  .patch("/:id", async ({ params, body, set }: { params: any; body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {}; // Declare errors object
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      // Allow all fields to be optional
      if (body.id_karyawans && !body.id_karyawans) errors.id_karyawans = "ID Karyawan harus diisi";
      if (body.id_categories && !body.id_categories) errors.id_categories = "ID Kategori harus dipilih";
      if (body.id_priorities && !body.id_priorities) errors.id_priorities = "Prioritas harus dipilih";
      if (body.id_statuses && !body.id_statuses) errors.id_statuses = "Status harus dipilih";
      if (body.keluhan && !body.keluhan.trim()) errors.keluhan = "Keluhan harus diisi";
      if (body.eskalasi && !body.eskalasi.trim()) errors.eskalasi = "Eskalasi harus diisi";
      if (body.response && !body.response.trim()) errors.response = "Response harus diisi";
      if (body.analisa && !body.analisa.trim()) errors.analisa = "Analisa harus diisi";
      if (body.is_active === undefined) errors.is_active = "Status keaktifan harus diisi";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Gagal memperbarui tiket, periksa input!", errors };
      }

      await ticketing.update(body);
      set.status = 200;
      return { success: true, message: "Tiket berhasil diperbarui", data: ticketing };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal memperbarui tiket" };
    }
  })

  // DELETE - Soft delete tiket
  .delete("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      await ticketing.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Tiket berhasil dihapus (soft delete)" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal menghapus tiket" };
    }
  });

export default ticketingApi;
