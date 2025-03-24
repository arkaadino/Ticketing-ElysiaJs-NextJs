import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";
import authApi from "../api/authApi";
import ticketingApi from "../api/ticketingApi";
import statusesApi from "../api/statusesApi";
import karyawanApi from "../api/karyawanApi";
import categoriesApi from "../api/categoriesApi";
import priorityApi from "../api/priorityApi";
import eskalasiApi from "../api/eskalasiApi";



const server = new Elysia()
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }))
  .use(cookie())

  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "21f7bd3cc2d77f7f73ee97a25e6fb4b3d6f34c4425050e9e67b827f6b1d2809d",
      exp: "1d"
    })
  )
.use(authApi)
.use(ticketingApi)
.use(statusesApi)
.use(karyawanApi)
.use(categoriesApi)
.use(priorityApi)
.use(eskalasiApi);


export default server;
