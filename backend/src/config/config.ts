import { Dialect } from "sequelize";
import "dotenv/config";

interface DBConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
}

const development: DBConfig = {
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "adminlrs123",
  database: process.env.DB_NAME || "dbticketing",
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
};

const test: DBConfig = {
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "adminlrs123",
  database: process.env.DB_NAME || "dbticketing_test",
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
};

const production: DBConfig = {
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "adminlrs123",
  database: process.env.DB_NAME || "dbticketing_prod",
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
};

export default { development, test, production };
