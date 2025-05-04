import { client } from "./bd.js";

export async function setMonsterChannel(serverId, channelId) {
  try {
    const query = `
      INSERT INTO monster_channels (server_id, channel_id) 
      VALUES ($1, $2) 
      ON CONFLICT (server_id) DO UPDATE SET channel_id = EXCLUDED.channel_id
    `;
    const values = [serverId, channelId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al registrar el canal:", err);
    throw err;
  }
}

export async function verificarCanalMonstruo(serverId) {
  try {
    const query = "SELECT channel_id FROM monster_channels WHERE server_id = $1";
    const values = [serverId];

    const result = await client.query(query, values);
    return result.rows[0]?.channel_id || null;
  } catch (err) {
    console.error("❌ Error al verificar canal de monstruos:", err);
    throw err;
  }
}

export async function incrementarMensaje(serverId) {
  try {
    const query = `
      INSERT INTO message_count (server_id, count) 
      VALUES ($1, 1)
      ON CONFLICT (server_id) DO UPDATE SET count = message_count.count + 1
    `;
    const values = [serverId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al incrementar el contador:", err);
    throw err;
  }
}

export async function obtenerMensajeCount(serverId) {
  try {
    const query = "SELECT count FROM message_count WHERE server_id = $1";
    const values = [serverId];

    const result = await client.query(query, values);
    return result.rows[0]?.count || 0;
  } catch (err) {
    console.error("❌ Error al obtener contador de mensajes:", err);
    throw err;
  }
}

export async function reiniciarMensajeCount(serverId) {
  try {
    const query = "UPDATE message_count SET count = 0 WHERE server_id = $1";
    const values = [serverId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al reiniciar contador de mensajes:", err);
    throw err;
  }
}

// Monstruo

export async function agregarMonstruoActivo(serverId, monsterId, hp, element) {
  try {
    const query = `
      INSERT INTO active_monsters (server_id, monster_id, hp, element) 
      VALUES ($1, $2, $3, $4)
    `;
    const values = [serverId, monsterId, hp, element];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al agregar monstruo:", err);
    throw err;
  }
}

export async function verificarMonstruoActivo(serverId, monsterId) {
  try {
    const query = "SELECT id FROM active_monsters WHERE server_id = $1 AND monster_id = $2";
    const values = [serverId, monsterId];

    const result = await client.query(query, values);
    return result.rows.length > 0;
  } catch (err) {
    console.error("❌ Error al verificar monstruo activo:", err);
    throw err;
  }
}

export async function obtenerMonstruosActivos(serverId) {
  try {
    const query = `
      SELECT monster_id, hp 
      FROM active_monsters 
      WHERE server_id = $1
    `;
    const values = [serverId];

    const result = await client.query(query, values);
    return result.rows; // 🔹 Devuelve lista de monstruos activos
  } catch (err) {
    console.error("❌ Error al obtener monstruos activos:", err);
    throw err;
  }
}


export async function obtenerDetallesMonstruo(serverId, monsterId) {
  try {
    const query = "SELECT monster_id, hp, element FROM active_monsters WHERE server_id = $1 AND monster_id = $2";
    const values = [serverId, monsterId];

    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Error al obtener detalles del monstruo:", err);
    throw err;
  }
}

export async function actualizarHPMonstruo(serverId, monsterId, newHP) {
  try {
    const query = "UPDATE active_monsters SET hp = $1 WHERE server_id = $2 AND monster_id = $3";
    const values = [newHP, serverId, monsterId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al actualizar HP del monstruo:", err);
    throw err;
  }
}

export async function eliminarMonstruo(serverId, monsterId) {
  try {
    const query = "DELETE FROM active_monsters WHERE server_id = $1 AND monster_id = $2 AND hp <= 0";
    const values = [serverId, monsterId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al eliminar monstruo:", err);
    throw err;
  }
}

