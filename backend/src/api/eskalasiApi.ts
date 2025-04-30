import { Elysia } from "elysia";

import { Eskalasi } from "../models/eskalasi";
import { cors } from "@elysiajs/cors";

const eskalasiApi = new Elysia({ prefix: "/eskalasi" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah eskalasi baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.nik) errors.nik = "NIK harus diisi";
      if (!body.name?.trim()) errors.name = "Nama harus diisi";
      if (!body.position?.trim()) errors.position = "Posisi harus diisi";
      if (!body.unit_kerja?.trim()) errors.unit_kerja = "Unit kerja harus diisi";
      if (!body.job_title?.trim()) errors.job_title = "Job title harus diisi";
      if (!body.is_active || ![1, 0].includes(body.is_active)) errors.is_active = "Status keaktifan harus diisi";
      if (body.role === "admin" && !body.password) errors.password = "Password harus diisi untuk admin";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { 
          success: false, 
          message: "Gagal menambahkan eskalasi, periksa input!", 
          errors 
        };
      }

      const newEskalasi = await Eskalasi.create(body);

      set.status = 200;
      return { success: true, message: "Eskalasi berhasil ditambahkan", data: newEskalasi };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

    // GET - Ambil semua eskalasi (hanya yang aktif)
  .get("/", async ({ set }: { set: any }) => {
    try {
      const eskalasiList = await Eskalasi.findAll({ 
        where: { is_active: 1 }, 
      });
      if (!eskalasiList.length) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data eskalasi ditemukan", data: eskalasiList };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data eskalasi" };
    }
  })

  // GET - Ambil eskalasi berdasarkan ID (hanya yang aktif)
  .get("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const eskalasi = await Eskalasi.findOne({ where: { id: params.id, is_active: 1 } });
      if (!eskalasi) {
        set.status = 400;
        return { success: false, message: "Eskalasi tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data eskalasi ditemukan", data: eskalasi };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data eskalasi" };
    }
  })

  // PATCH - Update eskalasi
  .patch("/:id", async ({ params, body, set }: { params: any; body: any; set: any }) => {
    try {
      const eskalasi = await Eskalasi.findOne({
        where: { id: params.id, is_active: 1 },
        attributes: { include: ["password"] }, // ✅ Ensure password is included
      });
  
      if (!eskalasi) {
        set.status = 400;
        return { success: false, message: "Eskalasi tidak ditemukan" };
      }
  
      const updatedData = {
        nik: body.nik ?? eskalasi.nik,
        name: body.name ?? eskalasi.name,
        position: body.position ?? eskalasi.position,
        unit_kerja: body.unit_kerja ?? eskalasi.unit_kerja,
        job_title: body.job_title ?? eskalasi.job_title,
        is_active: body.is_active ?? eskalasi.is_active,
        password: body.password ?? eskalasi.password,
      };
  
      await eskalasi.update(updatedData);
  
      set.status = 200;
      return { success: true, message: "Eskalasi berhasil diperbarui", data: eskalasi };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal memperbarui eskalasi" };
    }
  })
    // DELETE - Soft delete eskalasi (update is_active ke 0 dan deleted_at diisi)
  .delete("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const eskalasi = await Eskalasi.findOne({ where: { id: params.id, is_active: 1 } });
      if (!eskalasi) {
        set.status = 400;
        return { success: false, message: "Eskalasi tidak ditemukan" };
      }

      await eskalasi.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Eskalasi berhasil dihapus" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal menghapus Eskalasi" };
    }
  });

export default eskalasiApi;
