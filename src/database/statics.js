import { db } from './bd.js';

export async function actualizarEstadisticas(userId, campo, cantidad) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO statistics (user_id, ${campo}) VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET ${campo} = ${campo} + ?`,
      [userId, cantidad, cantidad],
      function (err) {
        if (err) {
          console.error(`❌ Error al actualizar estadísticas en ${campo}:`, err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function getStatisticsByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM statistics WHERE user_id = ?",
      [userId],
      function (err, row) {
        if (err) {
          console.error("❌ Error al obtener estadísticas:", err);
          return reject(err);
        }
        resolve(row || { monstersDefeated: 0, totalDamage: 0 });
      }
    );
  });
}


// Tiempos

export async function actualizarTiempo(userId, campo) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO timers (user_id, ${campo}) VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET ${campo} = ?`,
      [userId, Date.now(), Date.now()],
      function (err) {
        if (err) {
          console.error(`❌ Error al actualizar ${campo}:`, err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function obtenerTiempo(userId, campo) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT ${campo} FROM timers WHERE user_id = ?`,
      [userId],
      function (err, row) {
        if (err) {
          console.error(`❌ Error al obtener ${campo}:`, err);
          return reject(err);
        }
        resolve(row ? row[campo] : 0);
      }
    );
  });
}

