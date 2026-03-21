import * as SQLite from "expo-sqlite";

export interface User {
  id: number;
  cedula: string;
  pin_hash: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  direccion: string;
  created_at: string;
}

export type NewUser = Omit<User, "id" | "created_at">;

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("bancaapp.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cedula TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      telefono TEXT NOT NULL,
      email TEXT NOT NULL,
      fecha_nacimiento TEXT NOT NULL,
      direccion TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );
  `);

  return db;
}

export async function createUser(user: NewUser): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `INSERT INTO users (cedula, pin_hash, nombre, apellido, telefono, email, fecha_nacimiento, direccion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.cedula,
      user.pin_hash,
      user.nombre,
      user.apellido,
      user.telefono,
      user.email,
      user.fecha_nacimiento,
      user.direccion,
    ]
  );
}

export async function getUserByCedula(cedula: string): Promise<User | null> {
  const database = await getDatabase();

  const result = await database.getFirstAsync<User>(
    "SELECT * FROM users WHERE cedula = ?",
    [cedula]
  );

  return result ?? null;
}
