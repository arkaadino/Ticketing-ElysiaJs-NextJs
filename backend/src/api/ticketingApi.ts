import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Ticketing } from "../models/ticketing";
import { Priority } from "../models/priority";
import { Category } from "../models/categories";
import { Status } from "../models/statuses";
import { Karyawan } from "../models/karyawan";
import { Eskalasi } from "../models/eskalasi";

const ticketingApi = new Elysia({ prefix: "/ticketings" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah tiket baru
  .post("/", async ({ body, set }: { body: any; set: any ; user?: any}) => {
    try {
      const errors: Record<string, string> = {}; 
  
      // Validasi wajib
      if (!body.id_karyawans) errors.id_karyawans = "ID Karyawan harus diisi";
      if (!body.id_categories) {
        errors.id_categories = "ID Kategori harus dipilih";
      } else {
        const categoryExists = await Category.findOne({ where: { id: body.id_categories } });
        if (!categoryExists) {
          errors.id_categories = "Kategori tidak valid";
        }
      }
      if (!body.keluhan?.trim()) errors.keluhan = "Keluhan harus diisi";
  
      // Tambahkan default values yang pasti dibutuhkan
      const ticketData = {
        id_karyawans: body.id_karyawans,
        id_categories: body.id_categories,
        keluhan: body.keluhan,
        tanggal_keluhan: new Date(), // Tambahkan tanggal keluhan
        id_statuses: 3, // Default status Open
        is_active: 1, // Default aktif
        id_eskalasis:  body.id_eskalasis, // Default null
        response: null,
        mulai_pengerjaan: null,
        selesai_pengerjaan: null,
        waktu_pengerjaan: null,
        ...body // Spread body untuk menimpa default values jika ada
      };
  
      console.log("Ticket Data to Create:", ticketData); // Log data yang akan dibuat
  
      const newTicket = await Ticketing.create(ticketData);
      
      set.status = 200;
      return { 
        success: true, 
        message: "Tiket berhasil ditambahkan", 
        data: newTicket 
      };
    } catch (error) {
      console.error("Error creating ticket:", error); // Log full error
      set.status = 500;
      return { 
        success: false, 
        message: "Terjadi kesalahan server",
        errorDetails: error instanceof Error ? error.message : String(error)
      };
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
          },
          {
            model: Eskalasi,
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
      const errors: Record<string, string> = {}; 
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Tiket tidak ditemukan" };
      }

      // Validasi kondisional untuk id_eskalasis
      if (body.id_eskalasis) {
        const eskalasiExists = await Eskalasi.findOne({ where: { id: body.id_eskalasis } });
        if (!eskalasiExists) {
          errors.id_eskalasis = "Eskalasi tidak valid";
        }
      }

      // Validasi untuk field lain yang diupdate
      if (body.id_statuses) {
        const statusExists = await Status.findOne({ where: { id: body.id_statuses } });
        if (!statusExists) {
          errors.id_statuses = "Status tidak valid";
        }
      }

      // Tambahkan validasi untuk field lain sesuai kebutuhan
      if (body.response && !body.response.trim()) {
        errors.response = "Response harus diisi";
      }

      if (Object.keys(errors).length) {
        set.status = 401;
        return { 
          success: false, 
          message: "Gagal memperbarui tiket, periksa input!", 
          errors 
        };
      }

      // Update tiket dengan data baru
      await ticketing.update(body);

      // Ambil data tiket terbaru setelah update
      const updatedTicket = await Ticketing.findOne({ 
        where: { id: params.id },
        include: [
          { model: Eskalasi, attributes: ["id", "name"] },
          { model: Status, attributes: ["id", "name"] }
        ]
      });

      set.status = 200;
      return { 
        success: true, 
        message: "Tiket berhasil diperbarui", 
        data: updatedTicket 
      };
    } catch (error) {
      console.error("Error updating ticket:", error);
      set.status = 500;
      return { 
        success: false, 
        message: "Gagal memperbarui tiket",
        errorDetails: error instanceof Error ? error.message : String(error)
      };
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
    
  })

  .get('/stats', async () => {
    const completedCount = await Ticketing.count({
      include: [{
        model: Status,
        where: { name: 'Completed' },
      }],
    });
  
    const ongoingCount = await Ticketing.count({
      include: [{
        model: Status,
        where: { name: 'Ongoing' },
      }],
    });
  
    return {
      completed: completedCount,
      ongoing: ongoingCount,
    };
  });
    
export default ticketingApi;
