import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import bcrypt from "bcrypt";
import { Karyawan } from "../models/karyawan";

const logserver = new Elysia()
    .use(cookie()) // Plugin untuk membaca & menyimpan cookie
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "supersecretkey",
            exp: "1d", // Token kedaluwarsa dalam 1 hari
        })
    )
    .post("/loginsave", async (ctx) => {
        const { nik, password } = ctx.body as { nik: number; password: string };

        // Cek apakah karyawan dengan NIK tersebut ada
        const karyawan = await Karyawan.findOne({ where: { nik } });

        if (!karyawan || karyawan.role !== "admin") {
            ctx.set.status = 401;
            return { message: "Akun tidak ditemukan atau bukan admin!" };
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(password, karyawan.password!);
        if (!passwordMatch) {
            ctx.set.status = 401;
            return { message: "Password salah!" };
        }

        // Generate JWT Token
        const token = await ctx.jwt.sign({
            id: karyawan.id,
            nik: karyawan.nik,
            name: karyawan.name,
            role: karyawan.role,
        });

        // Simpan JWT di cookie
        ctx.set.cookie = {
            auth_token: {
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 hari
            }
        };

        return { message: "Login berhasil!", token };

        
        logserver.post("/logout", (ctx) => {
            ctx.set.cookie = {
                auth_token: {
                    value: "",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 0, // Hapus cookie dengan mengatur maxAge ke 0
                }
            };
        
            return { message: "Logout berhasil!" };
        });
        
        
    });

export default logserver;
