import { Elysia, t } from "elysia";
import { Karyawan } from "../models/karyawan";
import jwt from "jsonwebtoken";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";

const authApi = new Elysia({ prefix: "/auth" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  .use(cookie())

  .post("/login", async ({ body, set, cookie }) => {
    try {
      const { nik, password } = body;

      const user = await Karyawan.findOne({ where: { nik } });
      if (!user) {
        set.status = 400;
        return { message: "NIK tidak ditemukan!" };
      }

      const isMatch = await user.verifyPassword(password);
      if (!isMatch) {
        set.status = 400;
        return { message: "Password yang anda masukkan salah!" };
      }

      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }

      const token = jwt.sign(
        { id: user.id, nik: user.nik, name: user.name, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      cookie.token.set({
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60
      });

      return JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          nik: user.nik,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      set.status = 500;
      return JSON.stringify({ message: "Internal server error" });
    }
  }, {
    body: t.Object({
      nik: t.String(),
      password: t.String()
    })
  })

  .post("/logout", ({ cookie }) => {
    cookie.token.remove();
    return JSON.stringify({ 
      success: true,
      message: "Sampai Jumpa Lagi!" 
    });
  })

  .get("/me", ({ cookie }) => {
    try {
      const token = cookie.token.value;
      if (!token) {
        return JSON.stringify({ success: false, message: "Tidak ada token" });
      }

      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return JSON.stringify({ success: true, user: decoded });
    } catch (error) {
      return JSON.stringify({ success: false, message: "Token tidak valid atau sudah expired" });
    }
  });

export default authApi;
