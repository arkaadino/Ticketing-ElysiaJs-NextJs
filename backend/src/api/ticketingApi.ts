import { Elysia } from "elysia";
import { z } from "zod";
import { Ticketing } from "../models/ticketing";
import sequelize from "../config/db";

const app = new Elysia();

const TicketingSchema = z.object({
    id_karyawans: z.number().min(1, "ID Karyawan harus lebih besar dari 0"),
    id_categories: z.number().min(1, "ID Kategori harus lebih besar dari 0"),
    id_priorities: z.number().min(1, "ID Prioritas harus lebih besar dari 0"),
    id_statuses: z.number().min(1, "ID Status harus lebih besar dari 0"),
    keluhan: z.string().min(1, "Keluhan tidak boleh kosong"),
    tanggal_keluhan: z.date().min(new Date("2025-02-15"), "Tanggal keluhan tidak valid"),
    eskalasi: z.string().min(1, "Eskalasi tidak boleh kosong"),
    response: z.string().min(1, "Response tidak boleh kosong"),
    pending: z.string().min(1, "Pending tidak boleh kosong"),
    analisa: z.string().min(1, "Analisa tidak boleh kosong"),
    mulai_pengerjaan: z.date().nullable(),
    selesai_pengerjaan: z.date().nullable(),
    waktu_pengerjaan: z.date().nullable(),
    is_active: z.number().min(1, "Status tidak boleh kosong"),
});

// GET - Ambil semua tiket
app.get("/master/ticketings", async ({ error }) => {
    try {
        const tickets = await Ticketing.findAll();
        if (tickets.length === 0) {
            return error(400, { message: "Data tidak ditemukan" });
        }
        return {
            code: 200,
            message: "Data tiket ditemukan",
            data: tickets
        };
    } catch (err) {
        console.error("❌ Error saat mengambil data tiket:", err);
        return error(500, { message: "Terjadi kesalahan pada server" });
    }
});

// POST - Tambah tiket baru
app.post("/master/ticketings", async ({ error, body }) => {
    try {
        const parsed = TicketingSchema.safeParse(body);
        if (!parsed.success) {
            return error(400, { message: "Validasi gagal", errors: parsed.error.errors });
        }
        const ticket = await Ticketing.create(parsed.data);
        return {
            code: 200,
            message: "Tiket berhasil ditambahkan",
            data: ticket
        };
    } catch (err) {
        console.error("❌ Error saat menambahkan tiket:", err);
        return error(500, { message: "Terjadi kesalahan pada server" });
    }
});

// PATCH - Edit tiket
app.patch("/master/ticketings/:id", async ({ error, body, params }) => {
    try {
        const ticket = await Ticketing.findByPk(params.id);
        if (!ticket) {
            return error(400, { message: "Tiket tidak ditemukan" });
        }
        const parsed = TicketingSchema.partial().safeParse(body);
        if (!parsed.success) {
            return error(400, { message: "Validasi gagal", errors: parsed.error.errors });
        }
        await ticket.update(parsed.data);
        return {
            code: 200,
            message: "Tiket berhasil diperbarui",
            data: ticket
        };
    } catch (err) {
        console.error("❌ Error saat memperbarui tiket:", err);
        return error(500, { message: "Terjadi kesalahan pada server" });
    }
});

// DELETE - Soft delete tiket
app.delete("/master/ticketings/:id", async ({ error, params }) => {
    try {
        const ticket = await Ticketing.findByPk(params.id);
        if (!ticket) {
            return error(400, { message: "Tiket tidak ditemukan" });
        }
        ticket.deleted_at = new Date();
        ticket.is_active = 0;
        await ticket.save();
        return {
            code: 200,
            message: "Tiket berhasil dihapus (soft delete)",
            data: ticket
        };
    } catch (err) {
        console.error("❌ Error saat menghapus tiket:", err);
        return error(500, { message: "Terjadi kesalahan pada server" });
    }
});

export default app;
