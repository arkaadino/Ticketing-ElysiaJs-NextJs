import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { Karyawan } from "../models/karyawan";
import { Priority } from "../models/priority";

const karyawanApi = new Elysia({ prefix: "/karyawan" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Tambah karyawan baru
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {};

      if (!body.nik) errors.nik = "NIK harus diisi";
      if (!body.name?.trim()) errors.name = "Nama harus diisi";
      if (!body.position?.trim()) errors.position = "Position harus diisi";
      if (!body.unit_kerja?.trim()) errors.unit_kerja = "Unit kerja harus diisi";
      if (!body.job_title?.trim()) errors.job_title = "Job title harus diisi";
      if (!body.is_active || ![1, 0].includes(body.is_active)) errors.is_active = "Status keaktifan harus diisi";
      if (!body.id_priorities) {
        errors.id_priorities = "Prioritas harus dipilih";
      } else {
        const priorityExists = await Priority.findOne({ where: { id: body.id_priorities } });
        if (!priorityExists) {
          errors.id_priorities = "Prioritas tidak valid";
        }
      }      
      if (Object.keys(errors).length) {
        set.status = 400;
        return { 
          success: false, 
          message: "Gagal menambahkan karyawan, periksa input!", 
          errors 
        };
      }

      const newKaryawan = await Karyawan.create(body);

      set.status = 200;
      return { success: true, message: "Karyawan berhasil ditambahkan", data: newKaryawan };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Terjadi kesalahan server" };
    }
  })

    // GET - Ambil semua karyawan (hanya yang aktif)
  .get("/", async ({ set }: { set: any }) => {
    try {
      const karyawanList = await Karyawan.findAll({ 
        where: { is_active: 1 }, 
        include: [{
          model: Priority,
          attributes: ["id", "sla", "level"]
        },
      ],
      });
      if (!karyawanList.length) {
        set.status = 400;
        return { success: false, message: "Data tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data karyawan ditemukan", data: karyawanList };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data karyawan" };
    }
  })

  // GET - Ambil karyawan berdasarkan ID (hanya yang aktif)
  .get("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const karyawan = await Karyawan.findOne({ where: { id: params.id, is_active: 1 } });
      if (!karyawan) {
        set.status = 400;
        return { success: false, message: "Karyawan tidak ditemukan" };
      }

      set.status = 200;
      return { success: true, message: "Data karyawan ditemukan", data: karyawan };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal mengambil data karyawan" };
    }
  })

  // PATCH - Update karyawan
  .patch("/:id", async ({ params, body, set }: { params: any; body: any; set: any }) => {
    try {
      const karyawan = await Karyawan.findOne({
        where: { id: params.id, is_active: 1 },
      });
  
      if (!karyawan) {
        set.status = 400;
        return { success: false, message: "Karyawan tidak ditemukan" };
      }
  
      const updatedData = {
        nik: body.nik ?? karyawan.nik,
        name: body.name ?? karyawan.name,
        position: body.position ?? karyawan.position,
        unit_kerja: body.unit_kerja ?? karyawan.unit_kerja,
        job_title: body.job_title ?? karyawan.job_title,
        is_active: body.is_active ?? karyawan.is_active,
        id_priorities: body.id_priorities ?? karyawan.id_priorities,
      };
  
      await karyawan.update(updatedData);
  
      set.status = 200;
      return { success: true, message: "Karyawan berhasil diperbarui", data: karyawan };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal memperbarui karyawan" };
    }
  })
    // DELETE - Soft delete karyawan (update is_active ke 0 dan deleted_at diisi)
  .delete("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const karyawan = await Karyawan.findOne({ where: { id: params.id, is_active: 1 } });
      if (!karyawan) {
        set.status = 400;
        return { success: false, message: "Karyawan tidak ditemukan" };
      }

      await karyawan.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Karyawan berhasil dihapus" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal menghapus karyawan" };
    }
  });

export default karyawanApi;
