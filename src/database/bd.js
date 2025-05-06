import dotenv from "dotenv";
dotenv.config();

import { Client } from "pg";

// 🔹 Configuración de la conexión con PostgreSQL en Render
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { mode: "require" }
});

// 🔹 Conectar a la base de datos
async function initializeDatabase() {
  try {
    await client.connect();
    console.log("✅ Base de datos conectada correctamente.");
  } catch (err) {
    console.error("❌ Error al conectar:", err.message);
  }

  // 🔹 Eliminar tablas si existen (se ejecutan por separado)
  const dropTables = [
    "DROP TABLE IF EXISTS inventory",
    "DROP TABLE IF EXISTS equipment",
    "DROP TABLE IF EXISTS monster_channels",
    "DROP TABLE IF EXISTS active_monsters",
    "DROP TABLE IF EXISTS message_count",
    "DROP TABLE IF EXISTS combat_log",
    "DROP TABLE IF EXISTS statistics",
    "DROP TABLE IF EXISTS timers",
    "DROP TABLE IF EXISTS characters"
  ];

  // for (const query of dropTables) {
  //   await client.query(query);
  //   console.log(`✅ Tabla eliminada: ${query}`);
  // }

  // const myquery = `UPDATE characters SET gold = 10000 WHERE user_id = '1016566942267605002'`

  // 🔹 Creación de tablas si no existen
  const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS characters (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    race TEXT NOT NULL,
    nivel INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    hp INTEGER NOT NULL,
    hpmax INTEGER NOT NULL,
    mana INTEGER NOT NULL,
    manamax INTEGER NOT NULL,
    atkfisico INTEGER NOT NULL,
    deffisica INTEGER NOT NULL,
    atkmagico INTEGER NOT NULL,
    defmagica INTEGER NOT NULL,
    precision INTEGER NOT NULL,
    evasion INTEGER NOT NULL,
    gold INTEGER DEFAULT 100,
    elemento TEXT DEFAULT NULL,
    statPoints INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS inventory (
    user_id TEXT NOT NULL,
    iditem INTEGER NOT NULL,
    category TEXT NOT NULL,
    item_order INTEGER NOT NULL,
    PRIMARY KEY (user_id, item_order),
    FOREIGN KEY (user_id) REFERENCES characters(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS equipment (
    user_id TEXT NOT NULL,
    iditem INTEGER NOT NULL,
    category TEXT NOT NULL,
    slot TEXT NOT NULL,
    PRIMARY KEY (user_id, slot),
    FOREIGN KEY (user_id) REFERENCES characters(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS monster_channels (
    server_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS active_monsters (
    id SERIAL PRIMARY KEY,
    server_id TEXT NOT NULL,
    monster_id INTEGER NOT NULL,
    hp INTEGER NOT NULL,
    element TEXT NOT NULL,
    status TEXT DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS message_count (
    server_id TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS combat_log (
    id SERIAL PRIMARY KEY,
    server_id TEXT NOT NULL,
    monster_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    damage INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS statistics (
    user_id TEXT PRIMARY KEY,
    monstersdefeated INTEGER DEFAULT 0,
    totaldamage INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS timers (
    user_id TEXT PRIMARY KEY,
    lastattack BIGINT DEFAULT 0,
    lastregen BIGINT DEFAULT 0
  );

  -- 🔹 Tabla de intercambios entre jugadores
  CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    usuario1 TEXT NOT NULL,
    usuario2 TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'aceptado', 'cancelado'
    FOREIGN KEY (usuario1) REFERENCES characters(user_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario2) REFERENCES characters(user_id) ON DELETE CASCADE
);

-- 🔹 Tabla de ítems en intercambios
  CREATE TABLE IF NOT EXISTS trade_items (
    trade_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    iditem INTEGER NOT NULL,
    FOREIGN KEY (trade_id) REFERENCES trades(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES characters(user_id) ON DELETE CASCADE,
    FOREIGN KEY (iditem) REFERENCES inventory(iditem) ON DELETE CASCADE
);

  CREATE TABLE IF NOT EXISTS kit_redemptions (
    user_id TEXT NOT NULL,
    kit_code TEXT NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, kit_code)
  );

`;

  try {
    await client.query(createTablesQuery);
    console.log("✅ Tablas creadas correctamente.");
  } catch (err) {
    console.error("❌ Error en la creación de tablas:", err.message);
  }
}
// 🔹 Exportar la conexión
export { client, initializeDatabase };