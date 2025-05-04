import { client } from './bd.js';

// 🔹 Guarda el personaje sin validaciones
export async function createCharacter(characterData) {
  const {
    user_id, name, race, nivel = 1, xp = 0, hpmax, hp, mana, manamax,
    atkfisico, deffisica, atkmagico, defmagica,
    precision, evasion, gold = 100, elemento
  } = characterData;

  try {
    const query = `
      INSERT INTO characters 
      (user_id, name, race, nivel, xp, hp, hpmax, mana, manamax, atkfisico, deffisica, atkmagico, defmagica, precision, evasion, gold, elemento) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `;

    const values = [
      user_id, name, race, nivel, xp, hp, hpmax, mana, manamax,
      atkfisico, deffisica, atkmagico, defmagica,
      precision, evasion, gold, elemento
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
    let query = `UPDATE characters SET ${stat} = ${stat} + $1, statPoints = statPoints - $2`;

    // 🔹 Ajuste de hpmax y manamax si aplica
    const values = [incremento, cantidad, userId];
    if (stat === "hp") {
      query += `, hpmax = hpmax + $3`;
      values.splice(2, 0, incremento); // Inserta el incremento en la posición correcta
    } else if (stat === "mana") {
      query += `, manamax = manamax + $3`;
      values.splice(2, 0, incremento);
    }

    query += ` WHERE user_id = $${values.length}`;

    await client.query(query, values);

    return true; // Devuelve `true` si la actualización fue exitosa
  } catch (err) {
    console.error("❌ Error al actualizar stat:", err);
    throw err; // Propaga el error para manejarlo en la llamada de la función
  }
}

export async function regenerarRecursos(userId) {
  try {
    const query = `
      UPDATE characters 
      SET hp = LEAST(hpmax, hp + 10), 
          mana = LEAST(manamax, mana + 10) 
      WHERE user_id = $1
    `;

    const values = [userId];

    await client.query(query, values);

    return true; // Devuelve `true` si la actualización fue exitosa
  } catch (err) {
    console.error("❌ Error al regenerar HP y Mana:", err);
    throw err; // Propaga el error para manejarlo en la llamada de la función
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
