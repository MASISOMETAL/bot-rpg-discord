import { db } from './bd.js';

// 🔹 Guarda el personaje sin validaciones
async function createCharacter(characterData) {
  const {
    user_id, name, race, nivel, xp, hpMax, hp, mana, manaMax,
    atkFisico, defFisica, atkMagico, defMagica,
    presicion, evasion, gold, elemento
  } = characterData;

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO characters (user_id, name, race, nivel, xp, hp, hpMax, mana, manaMax, atkFisico, defFisica, atkMagico, defMagica, presicion, evasion, gold, elemento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, name, race, nivel, xp, hp, hpMax, mana, manaMax, atkFisico, defFisica, atkMagico, defMagica, presicion, evasion, gold, elemento], function (err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

// 🔹 Obtiene el personaje si existe
async function getCharacterByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM characters WHERE user_id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function updateCharacterGold(userId, newGoldAmount) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE characters SET gold = ? WHERE user_id = ?`,
      [newGoldAmount, userId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export { createCharacter, getCharacterByUserId, updateCharacterGold };

export async function obtenerNivelUsuario(userId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT nivel FROM characters WHERE user_id = ?`, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.nivel : null); // 🔹 Si el usuario no tiene personaje, devuelve `null`
    });
  });
}

export async function actualizarStat(userId, stat, incremento, cantidad) {
  let query = `UPDATE characters SET ${stat} = ${stat} + ?, statPoints = statPoints - ?`;

  if (stat === "hp") {
    query += `, hpMax = hpMax + ?`;
  } else if (stat === "mana") {
    query += `, manaMax = manaMax + ?`;
  }

  query += ` WHERE user_id = ?`;

  return new Promise((resolve, reject) => {
    db.run(
      query,
      stat === "hp" || stat === "mana" ? [incremento, cantidad, incremento, userId] : [incremento, cantidad, userId],
      function (err) {
        if (err) {
          console.error("❌ Error al asignar puntos:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}



export async function regenerarRecursos(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE characters 
      SET hp = MIN(hpMax, hp + 10), 
          mana = MIN(manaMax, mana + 10) 
      WHERE user_id = ?`,
      [userId],
      function (err) {
        if (err) {
          console.error("❌ Error al regenerar HP y Mana:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function actualizarRecursos(userId, hpRecuperado, manaRecuperado) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE characters 
      SET hp = MIN(hpMax, hp + ?), 
        mana = MIN(manaMax, mana + ?) 
      WHERE user_id = ?`,
      [hpRecuperado, manaRecuperado, userId],
      function (err) {
        if (err) {
          console.error("❌ Error al actualizar HP y Mana:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

// Nueva funcion equipar y desequipar items

export async function modificarStatsPersonaje(userId, stats, operacion) {
  return new Promise((resolve, reject) => {
    const signo = operacion === "sumar" ? "+" : "-";
    db.run(
      `UPDATE characters 
        SET hpMax = hpMax ${signo} ?, manaMax = manaMax ${signo} ?, 
            atkFisico = atkFisico ${signo} ?, defFisica = defFisica ${signo} ?, 
            atkMagico = atkMagico ${signo} ?, defMagica = defMagica ${signo} ?, 
            presicion = presicion ${signo} ?, evasion = evasion ${signo} ?, 
            hp = MIN(hp, hpMax), -- 🔹 Asegurar que HP no supere hpMax
            mana = MIN(mana, manaMax) -- 🔹 Asegurar que Mana no supere manaMax
        WHERE user_id = ?`,
      [stats.hp || 0, stats.mana || 0, stats.atkFisico || 0, stats.defFisica || 0, stats.atkMagico || 0, stats.defMagica || 0, stats.presicion || 0, stats.evasion || 0, userId],
      function (err) {
        if (err) {
          console.error("❌ Error al modificar stats del personaje:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function actualizarHPPersonaje(userId, newHP) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE characters 
      SET hp = MAX(0, ?) -- 🔹 Asegura que HP nunca sea negativo
      WHERE user_id = ?`,
      [newHP, userId],
      function (err) {
        if (err) {
          console.error("❌ Error al actualizar HP del personaje:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}
