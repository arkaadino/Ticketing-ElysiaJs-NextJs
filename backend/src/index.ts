import { Elysia } from "elysia";
import sequelize from "./config/db";
import statusesApi from "./api/statusesApi"; // Match the existing file name
import categoriesApi from "./api/categoriesApi"; // Match the existing file name
import karyawanApi from "./api/karyawanApi";
import priorityApi from "./api/priorityApi";
import ticketingApi from "./api/ticketingApi";
import { connectAndSyncDB } from "./config/db";
import logserver from "./config/server";
import cors from "@elysiajs/cors";

const app = new Elysia();

app.get("/", () => "BACKEND API");

app.use(cors({
    origin: "http://localhost:3000", // Allow Next.js frontend
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow cookies if needed
}));// Use the API routes

app.use(logserver);
app.use(statusesApi);
app.use(categoriesApi);
app.use(karyawanApi);
app.use(priorityApi);
app.use(ticketingApi);

connectAndSyncDB().then(() => {
    console.log("✅ Memulai server...");
}).catch(err => {
    console.error("❌ Gagal menghubungkan database:", err);
});

export default app;