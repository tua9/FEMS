import "dotenv/config";
import mysql from "mysql2/promise";


const DB_PORT = Number(process.env.DB_PORT) || 3306;

const isProd = process.env.NODE_ENV === "production";
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// log máy dev ( development ) mới in ra config db
if (!isProd) {
  console.log("🔍 DB CONFIG:");
  console.log("HOST:", DB_HOST);
  console.log("PORT:", DB_PORT);
  console.log("USER:", DB_USER);
  console.log("DB:", DB_NAME);
}


const shouldUseSSL =
  process.env.DB_SSL === "true" ||
  (!!DB_HOST &&
    DB_HOST !== "localhost" &&
    DB_HOST !== "127.0.0.1" &&
    DB_HOST !== "::1");

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  ...(shouldUseSSL
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export const testDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error(" MySQL connection failed");
    console.error("Message :", error.message);
    console.error("Code    :", error.code);
    throw error; 
  }
};

export default pool;
