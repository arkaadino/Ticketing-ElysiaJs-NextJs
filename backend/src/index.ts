import { Elysia } from "elysia";
import sequelize from "./config/db";
import server from "./config/server";
import { connectAndSyncDB } from "./config/db";
import cors from "@elysiajs/cors";


const app = new Elysia()
  .use(cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
  }))
    .options("/*", ({ set }) => {
        set.headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
        set.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        set.headers["Access-Control-Allow-Credentials"] = "true";
        return new Response(null, { status: 204 });
    })
  .get("/", () => "BACKEND API")
  .use(server);
    
    connectAndSyncDB().then(() => {
    console.log("✅ Memulai server...");
}).catch(err => {
    console.error("❌ Gagal menghubungkan database:", err);
});


export default app;
