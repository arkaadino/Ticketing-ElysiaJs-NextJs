  import { Status, StatusEntity } from "../models/statuses";
  import sequelize from "../config/db";
  import { Elysia } from "elysia";
  import { z } from "zod";

  const app = new Elysia();

  const StatusesSchema = z.object({
    name: z.string()
    .trim()
    .min(1, "Nama status tidak boleh kosong atau hanya berisi spasi"),
    is_active: z.number()
    .min(1, "Status tidak boleh kosong"),
  })

  app.get("/master/statuses", async ({error}) => {
    try {
      console.log("📥 Menjalankan query untuk mengambil status...");

      if (!sequelize.isDefined('Status')) {
        throw new Error('Model Status belum terinisialisasi!');
      }


      const status = await Status.findAll({
        where: {
          is_active: 1,
        },
      });

      if (status.length === 0) {
        return error(400, { message: "Data tidak ditemukan" });
    }

      console.log("✅ Query berhasil, hasil:", status);

      return {
        code: 200,
        message: "Data status ditemukan",
        data: status, // Return the data array
      };
    } catch (error) {
      console.error("❌ Error saat mengambil data:", error);
      return {
        code: 500,
        message: "Data status tidak dapat ditemukan",
      };
    }
  });


  app.post("/master/statuses", async ({error, body, params}) => {
    try {
      // Check if the request body is JSON
      const parsed = StatusesSchema.safeParse(body);
      if (!parsed.success) {
        return error (400, parsed.error.errors);
      }
      
      const status = await Status.create(parsed.data);

      return {
        code: 200,
        message: "Data status berhasil ditambahkan",
        data: status,  // Return the newly created status data
      };
    } catch (error) {
      console.error("❌ Error saat menambahkan data status:", error);
      return {
        code: 500,
        message: "Gagal menambahkan data status",
      };
    }
  });


  // PATCH - Edit Status
  app.patch("/master/statuses/:id", async ({error, body, params}) => {
    try {
      const parsed = StatusesSchema.safeParse(body);
      if (!parsed.success) {
        return error (400, parsed.error.errors);
      }

      const status = await Status.create(parsed.data);

      return {
        code: 200,
        message: "Data status berhasil diperbarui",
        data: status,
      };
    } catch (err) {
      console.error("❌ Error saat menambahkan tiket:", err);
      return error(500, { message: "Terjadi kesalahan pada server" });
  }
});

  // SOFT DELETE - Hapus Status
  app.delete("/master/statuses/:id", async ({error, params}) => {
    try {
      const id = params.id; // Get ID from URL parameter

      // Validate ID
      const status = await Status.findByPk(id);
      if (!status) {
        return error(400, "Id tidak dapat ditemukan!");
      }

      // Soft delete by setting deleted_at
      status.deleted_at = new Date();
      await status.save();

      return {
        code: 200,
        message: "Data status berhasil dihapus (soft delete)",
        data: status,
      };
    } catch (err) {
      console.error("❌ Error saat menambahkan tiket:", err);
      return error(500, { message: "Terjadi kesalahan pada server" });
  }
});

  export default app;
