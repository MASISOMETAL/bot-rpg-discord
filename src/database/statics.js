import { client } from './bd.js';

export async function actualizarEstadisticas(userId, campo, cantidad) {
  try {
    const query = `
      INSERT INTO statistics (user_id, ${campo}) 
      VALUES ($1, $2)
      ON CONFLICT (user_id) 
      DO UPDATE SET ${campo} = COALESCE(statistics.${campo}, 0) + $2
    `;
    const values = [userId, cantidad];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error(`❌ Error al actualizar estadísticas en ${campo}:`, err);
    throw err;
  }
}


export async function getStatisticsByUserId(userId) {
  try {
    const query = "SELECT * FROM statistics WHERE user_id = $1";
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows[0] || { monstersdefeated: 0, totaldamage: 0 };
  } catch (err) {
    console.error("❌ Error al obtener estadísticas:", err);
    throw err;
  }
}

// Tiempos

export async function actualizarTiempo(userId, campo) {
  try {
    const query = `
      INSERT INTO timers (user_id, ${campo})
      VALUES ($1, NOW())
      ON CONFLICT (user_id) DO UPDATE 
      SET ${campo} = NOW();
    `;
    const values = [userId];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error(`❌ Error al actualizar ${campo}:`, err);
    throw err;
  }
}


export async function obtenerTiempo(userId, campo) {
  try {
    const query = `SELECT ${campo} FROM timers WHERE user_id = $1`;
    const values = [userId];

    const result = await client.query(query, values);

    return result.rows[0]?.[campo] ? new Date(result.rows[0][campo]) : null;
  } catch (err) {
    console.error(`❌ Error al obtener ${campo}:`, err);
    throw err;
  }
}

