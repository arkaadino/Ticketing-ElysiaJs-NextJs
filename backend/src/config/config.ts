import { Dialect } from "sequelize";
import "dotenv/config";

interface DBConfig {
  username: string;
  password?: string;
  database: string;
  host: string;
  dialect: Dialect;
}

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`❌ Environment variable ${key} tidak ditemukan!`);
  }
  return value;
};

const development: DBConfig = {
  username: getEnvVar("DB_USER", "admin"),
  password: process.env.DB_PASS, // Bisa undefined jika tidak diatur
  database: getEnvVar("DB_NAME", "dbticketing"),
  host: getEnvVar("DB_HOST", "127.0.0.1"),
  dialect: "mysql",
};

const test: DBConfig = {
  username: getEnvVar("DB_USER", "admin"),
  password: process.env.DB_PASS,
  database: getEnvVar("DB_NAME", "dbticketing_test"),
  host: getEnvVar("DB_HOST", "127.0.0.1"),
  dialect: "mysql",
};

const production: DBConfig = {
  username: getEnvVar("DB_USER", "admin"),
  password: process.env.DB_PASS,
  database: getEnvVar("DB_NAME", "dbticketing_prod"),
  host: getEnvVar("DB_HOST", "127.0.0.1"),
  dialect: "mysql",
};

// Pilih konfigurasi berdasarkan NODE_ENV
const config: Record<string, DBConfig> = { development, test, production };

export default config;
