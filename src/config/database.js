import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const dbCon = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

dbCon.connect()
    .then(client => {
        console.log("Database connected successfully!");
        client.release();
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

export default dbCon;