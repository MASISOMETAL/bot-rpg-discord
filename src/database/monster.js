import { db } from "./bd.js";

export async function setMonsterChannel(serverId, channelId) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO monster_channels (server_id, channel_id) 
      VALUES (?, ?) 
      ON CONFLICT(server_id) DO UPDATE SET channel_id = excluded.channel_id
    `, [serverId, channelId], (err) => {
      if (err) {
        console.error("❌ Error al registrar el canal:", err.message);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function verificarCanalMonstruo(serverId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT channel_id FROM monster_channels WHERE server_id = ?`, [serverId], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.channel_id : null);
    });
  });
}

export async function incrementarMensaje(serverId) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO message_count (server_id, count) VALUES (?, 1)
      ON CONFLICT(server_id) DO UPDATE SET count = count + 1;
    `, [serverId], (err) => {
      if (err) {
        console.error("❌ Error al incrementar el contador:", err.message);
        return reject(err);
      }
      resolve();
    });
  });
}


export async function obtenerMensajeCount(serverId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT count FROM message_count WHERE server_id = ?`, [serverId], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.count : 0);
    });
  });
}

export async function reiniciarMensajeCount(serverId) {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE message_count SET count = 0 WHERE server_id = ?`, [serverId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Monstruo

export async function agregarMonstruoActivo(serverId, monsterId, hp, element) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO active_monsters (server_id, monster_id, hp, element) 
      VALUES (?, ?, ?, ?);
    `, [serverId, monsterId, hp, element], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function verificarMonstruoActivo(serverId, monsterId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT id FROM active_monsters 
      WHERE server_id = ? AND monster_id = ?;
    `, [serverId, monsterId], (err, row) => {
      if (err) return reject(err);
      resolve(row ? true : false);
    });
  });
}

export async function obtenerMonstruosActivos(serverId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT monster_id, hp FROM active_monsters WHERE server_id = ?`, [serverId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function obtenerDetallesMonstruo(serverId, monsterId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT monster_id, hp, element FROM active_monsters WHERE server_id = ? AND monster_id = ?`, [serverId, monsterId], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

export async function actualizarHPMonstruo(serverId, monsterId, newHP) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE active_monsters SET hp = ? WHERE server_id = ? AND monster_id = ?`,
      [newHP, serverId, monsterId],
      function (err) {
        if (err) {
          console.error("❌ Error al actualizar HP del monstruo:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function eliminarMonstruo(serverId, monsterId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM active_monsters WHERE server_id = ? AND monster_id = ? AND hp <= 0`,
      [serverId, monsterId],
      function (err) {
        if (err) {
          console.error("❌ Error al eliminar el monstruo:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}
