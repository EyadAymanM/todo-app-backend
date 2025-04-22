import sqlite3Pkg from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Needed for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { verbose } = sqlite3Pkg;
const sqlite3 = verbose();

const db = new sqlite3.Database("./data.sqlite", (err) => {
  if (err) console.error("Failed to connect to DB", err);
  else console.log("Connected to SQLite");
});

// Load and execute schema.sql
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema, (err) => {
  if (err) console.error("Failed to run schema", err);
});

export default db;
