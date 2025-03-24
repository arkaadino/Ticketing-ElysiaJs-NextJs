import { Elysia, t } from "elysia";
import { Eskalasi } from "../models/eskalasi";
import jwt from "jsonwebtoken";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { JwtPayload } from 'jsonwebtoken';

interface AccessTokenPayload extends JwtPayload {
  id: number;
  nik: string;
  name: string;
}

interface RefreshTokenPayload extends JwtPayload {
  id: number;
}
const authApi = new Elysia({ prefix: "/auth" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  .use(cookie())

  .post("/login", async ({ body, set, cookie }) => {
    try {
      const { nik, password } = body;

      const user = await Eskalasi.findOne({ where: { nik } });
      if (!user || user.is_active !== 1) {
        set.status = 400;
        return { message: "Akun tidak ditemukan atau tidak aktif!" };
      }
      
      const isMatch = await user.verifyPassword(password);
      if (!isMatch) {
        set.status = 400;
        return { message: "Password yang anda masukkan salah!" };
      }

      if (!process.env.JWT_SECRET_KEY || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT secret keys are not defined");
      }

      // Create access token (short-lived)
      const accessToken = jwt.sign(
        { id: user.id, nik: user.nik, name: user.name },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2h" } // Shorter expiration time
      );

      // Create refresh token (long-lived)
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1d" } // Much longer expiration
      );

      // Set cookies for both tokens
      cookie.accessToken.set({
        value: accessToken,
        httpOnly: true,
        path: "/",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2
      });

      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        path: "/",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24
      });

      return JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          nik: user.nik,
          name: user.name,
        }
      });
    } catch (error) {
      console.error(error); // Tambahkan ini untuk melihat error
      set.status = 500;
      return JSON.stringify({ message: "Internal server error" });    }
  }, {
    body: t.Object({
      nik: t.String(),
      password: t.String()
    })
  })

  .post("/refresh", async ({ cookie, set }) => {
    try {
        const refreshToken = cookie.refreshToken?.value;
        
        if (!refreshToken) {
          set.status = 401;
          return JSON.stringify({ message: "Refresh token tidak ditemukan" });
        }

        if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_SECRET_KEY) {
          throw new Error("JWT secret keys are not defined");
        }

        // Verify the refresh token with proper typing
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
        
        // Now TypeScript knows that decoded.id exists
        const user = await Eskalasi.findOne({ where: { id: decoded.id } });
        if (!user || user.is_active !== 1) {
          set.status = 401;
          return JSON.stringify({ message: "Akun tidak ditemukan atau tidak aktif" });
        }

          // Generate a new access token
          const newAccessToken = jwt.sign(
            { id: user.id, nik: user.nik, name: user.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15m" }
          );

          // Set the new access token cookie
          cookie.accessToken.set({
            value: newAccessToken,
            httpOnly: true,
            path: "/",
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 15 // 15 minutes
          });

          return JSON.stringify({ 
            success: true,
            message: "Token berhasil diperbarui" 
          });
        } catch (error) {
          set.status = 401;
          return JSON.stringify({ message: "Refresh token tidak valid atau sudah kedaluwarsa" });
        }
      })

  .post("/logout", ({ cookie }) => {
    // Clear both tokens
    cookie.accessToken.remove();
    cookie.refreshToken.remove();
    
    return JSON.stringify({ 
      success: true,
      message: "Sampai Jumpa Lagi!" 
    });
  })

  .get("/me", async ({ cookie, set }) => {
    try {
      const accessToken = cookie.accessToken?.value;
      if (!accessToken) {
        set.status = 401;
        return JSON.stringify({ success: false, message: "Tidak ada token akses" });
      }
  
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }
  
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as AccessTokenPayload;
  
      return JSON.stringify({ success: true, user: decoded });
    } catch (error) {
      set.status = 403;
      return JSON.stringify({ success: false, message: "Token tidak valid atau sudah kedaluwarsa" });
    }
  });
export default authApi;