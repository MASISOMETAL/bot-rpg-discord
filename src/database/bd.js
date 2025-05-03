import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database('./src/database/game.db', (err) => {
  if (err) {
    console.error("❌ Error al abrir la base de datos:", err.message);
  } else {
    console.log("✅ Base de datos conectada correctamente.");
  }
});

// 🔹 Creación de tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS characters (
      user_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      race TEXT NOT NULL,
      nivel INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      hp INTEGER NOT NULL,
      hpMax INTEGER NOT NULL, -- 🔹 Nuevo campo para HP máximo
      mana INTEGER NOT NULL,
      manaMax INTEGER NOT NULL, -- 🔹 Nuevo campo para Mana máximo
      atkFisico INTEGER NOT NULL,
      defFisica INTEGER NOT NULL,
      atkMagico INTEGER NOT NULL,
      defMagica INTEGER NOT NULL,
      presicion INTEGER NOT NULL,
      evasion INTEGER NOT NULL,
      gold INTEGER DEFAULT 100,
      elemento TEXT DEFAULT NULL,
      statPoints INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      user_id TEXT NOT NULL,
      idItem INTEGER NOT NULL,
      category TEXT NOT NULL,
      item_order INTEGER NOT NULL,
      PRIMARY KEY (user_id, item_order),
      FOREIGN KEY (user_id) REFERENCES characters(user_id),
      FOREIGN KEY (idItem) REFERENCES items(id)
    )
  `);


  db.run(`
    CREATE TABLE IF NOT EXISTS equipment (
      user_id TEXT NOT NULL,
      idItem INTEGER NOT NULL,
      category TEXT NOT NULL,
      slot TEXT NOT NULL,
      PRIMARY KEY (user_id, slot),
      FOREIGN KEY (user_id) REFERENCES characters(user_id),
      FOREIGN KEY (idItem) REFERENCES items(id)
    )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS monster_channels (
      server_id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS active_monsters (
      id INTEGER AUTO_INCREMENT PRIMARY KEY,
      server_id TEXT NOT NULL, -- 🔹 ID del servidor donde aparece el monstruo
      monster_id INTEGER NOT NULL, -- 🔹 ID del monstruo, tomado de monsters.js
      hp INTEGER NOT NULL, -- 🔹 HP restante del monstruo
      element TEXT NOT NULL, -- Elemento generado automaticamente
      status TEXT DEFAULT NULL -- 🔹 Estado activo aplicado al monstruo
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS message_count (
      server_id TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS combat_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      server_id TEXT NOT NULL,
      monster_id INT NOT NULL,
      user_id TEXT NOT NULL,
      damage INT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS statistics (
      user_id TEXT PRIMARY KEY,
      monstersDefeated INTEGER DEFAULT 0,
      totalDamage INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS timers (
      user_id TEXT PRIMARY KEY,
      lastAttack INTEGER DEFAULT 0,
      lastRegen INTEGER DEFAULT 0
    )
  `);

  console.log("✅ Tablas creadas correctamente.");
});

export { db };
