import { client } from './bd.js';

// 🔹 Guarda el personaje sin validaciones
export async function createCharacter(characterData) {
  const {
    user_id, name, race, nivel = 1, xp = 0, hpmax, hp, mana, manamax,
    atkfisico, deffisica, atkmagico, defmagica,
    precision, evasion, gold = 100, elemento,
  } = characterData;

  try {
    const query = `
      INSERT INTO characters 
      (user_id, name, race, nivel, xp, hp, hpmax, mana, manamax, atkfisico, deffisica, atkmagico, defmagica, precision, evasion, gold, elemento, statpoints) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *;
    `;

    const values = [
      user_id, name, race, nivel, xp, hp, hpmax, mana, manamax,
      atkfisico, deffisica, atkmagico, defmagica,
      precision, evasion, gold, elemento, 0
    ];

    const result = await client.query(query, values);

    return result.rows[0]; // Devuelve el personaje recién creado
  } catch (err) {
    console.error("❌ Error al crear personaje:", err);
    throw err; // Propaga el error para manejarlo en la llamada
  }
}


// 🔹 Obtiene el personaje si existe
export async function getCharacterByUserId(userId) {
  try {
    const query = "SELECT * FROM characters WHERE user_id = $1";
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows[0] || null; // 🔹 Devuelve el personaje si existe, o `null` si no hay resultado
  } catch (err) {
    console.error("❌ Error al obtener el personaje:", err);
    throw err; // 🔹 Rechaza el error para manejarlo en el llamado de la función
  }
}


export async function updateCharacterGold(userId, newGoldAmount) {
  try {
    const query = "UPDATE characters SET gold = $1 WHERE user_id = $2";
    const values = [newGoldAmount, userId];

    await client.query(query, values);

    return true; // Devuelve `true` si la actualización fue exitosa
  } catch (err) {
    console.error("❌ Error al actualizar el oro del personaje:", err);
    throw err; // Propaga el error para manejarlo en la llamada de la función
  }
}


export async function obtenerNivelUsuario(userId) {
  try {
    const query = "SELECT nivel FROM characters WHERE user_id = $1";
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows[0]?.nivel || null; // 🔹 Si el usuario no tiene personaje, devuelve `null`
  } catch (err) {
    console.error("❌ Error al obtener el nivel del usuario:", err);
    throw err; // 🔹 Propaga el error para manejarlo en la llamada de la función
  }
}

export async function actualizarStat(userId, stat, incremento, cantidad) {
  try {
    // 🔹 Base de la consulta UPDATE
    let query = `UPDATE characters SET ${stat} = ${stat} + $1, statpoints = GREATEST(0, statpoints - $2)`;

    const values = [incremento, cantidad, userId];

    // 🔹 Ajuste de hpmax y manamax si aplica
    if (stat === "hp") {
      query += `, hpmax = hpmax + $3`;
      values.push(incremento); // 🔹 Agregamos el incremento como nuevo valor en `values`
    } else if (stat === "mana") {
      query += `, manamax = manamax + $3`;
      values.push(incremento);
    }

    query += ` WHERE user_id = $${values.length}`; // 🔹 Ajustamos el índice de `user_id` correctamente

    await client.query(query, values);

    return true; // ✅ Devuelve `true` si la actualización fue exitosa
  } catch (err) {
    console.error("❌ Error al actualizar stat:", err);
    throw err; // 🔹 Propaga el error para manejarlo en la llamada de la función
  }
}


export async function regenerarRecursos(userId, bloques) {
  try {
    const cantidadRegen = 25 * bloques; // Regeneración acumulada

    const query = `
      UPDATE characters 
      SET hp = LEAST(hpmax, hp + $1), 
          mana = LEAST(manamax, mana + $1) 
      WHERE user_id = $2
    `;
    const values = [cantidadRegen, userId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al regenerar HP y Mana:", err);
    throw err;
  }
}


export async function actualizarRecursos(userId, hpRecuperado, manaRecuperado) {
  try {
    const query = `
      UPDATE characters 
      SET hp = LEAST(hpmax, hp + $1), 
          mana = LEAST(manamax, mana + $2) 
      WHERE user_id = $3
    `;

    const values = [hpRecuperado, manaRecuperado, userId];

    await client.query(query, values);

    return true; // 🔹 Devuelve `true` si la actualización fue exitosa
  } catch (err) {
    console.error("❌ Error al actualizar HP y Mana:", err);
    throw err;
  }
}


// Nueva funcion equipar y desequipar items

export async function modificarStatsPersonaje(userId, stats, operacion) {
  try {
    const signo = operacion === "sumar" ? "+" : "-";
    const query = `
      UPDATE characters 
      SET hpmax = hpmax ${signo} $1, manamax = manamax ${signo} $2, 
          atkfisico = atkfisico ${signo} $3, deffisica = deffisica ${signo} $4, 
          atkmagico = atkmagico ${signo} $5, defmagica = defmagica ${signo} $6, 
          precision = precision ${signo} $7, evasion = evasion ${signo} $8, 
          hp = LEAST(hpmax, hp), -- 🔹 Asegurar que HP no supere hpmax
          mana = LEAST(manamax, mana) -- 🔹 Asegurar que Mana no supere manamax
      WHERE user_id = $9
    `;

    const values = [
      stats.hp || 0, stats.mana || 0, stats.atkfisico || 0, stats.deffisica || 0,
      stats.atkmagico || 0, stats.defmagica || 0, stats.precision || 0, stats.evasion || 0, userId
    ];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al modificar stats del personaje:", err);
    throw err;
  }
}

export async function actualizarHPPersonaje(userId, newHP) {
  try {
    const query = `
      UPDATE characters 
      SET hp = GREATEST(0, $1) -- 🔹 Asegura que HP nunca sea negativo
      WHERE user_id = $2
    `;

    const values = [newHP, userId];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al actualizar HP del personaje:", err);
    throw err;
  }
}

// ranking

export async function getTopCharacters(limit = 50) {
  try {
    const query = `
      SELECT user_id, name, race, nivel, xp 
      FROM characters
      ORDER BY nivel DESC, xp DESC
      LIMIT $1
    `;
    const values = [limit];
    const { rows } = await client.query(query, values);
    return rows;
  } catch (error) {
    console.error("❌ Error al obtener el ranking:", error);
    throw error;
  }
}

export async function getUserRanking(userId) {
  try {
    // Obtenemos el nivel y xp del usuario
    const characterQuery = `SELECT nivel, xp FROM characters WHERE user_id = $1`;
    const characterRes = await client.query(characterQuery, [userId]);
    if (!characterRes.rows.length) {
      throw new Error("El personaje no se encontró");
    }
    const { nivel, xp } = characterRes.rows[0];

    // Contamos cuántos personajes tienen un nivel mayor
    // o el mismo nivel y mayor xp, lo que significa que están por encima.
    const rankingQuery = `
      SELECT COUNT(*) AS count
      FROM characters
      WHERE nivel > $1
        OR (nivel = $1 AND xp > $2)
    `;
    const rankingRes = await client.query(rankingQuery, [nivel, xp]);
    const count = parseInt(rankingRes.rows[0].count, 10);
    // La posición del usuario será el conteo + 1
    return count + 1;
  } catch (error) {
    console.error("❌ Error al obtener el ranking del usuario:", error);
    return null;
  }
}

export async function obtenerTodosLosJugadores() {
  try {
    const query = `SELECT user_id, name FROM characters`;
    const result = await client.query(query);

    return result.rows; // 🔹 Devuelve un array con todos los jugadores
  } catch (err) {
    console.error("❌ Error al obtener jugadores:", err);
    throw err;
  }
}
