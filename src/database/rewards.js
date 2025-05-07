import { client } from "./bd.js";
import { getCharacterByUserId } from "./characters.js";

export async function registrarAtaque(serverId, monsterId, userId, damage) {
  try {
    const query = `
      INSERT INTO combat_log (server_id, monster_id, user_id, damage) 
      VALUES ($1, $2, $3, $4)
    `;
    const values = [serverId, monsterId, userId, damage];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al registrar el ataque:", err);
    throw err;
  }
}

export async function calcularRecompensas(serverId, monsterId) {
  try {
    const query = `
      SELECT user_id, SUM(damage) AS total_damage 
      FROM combat_log 
      WHERE server_id = $1 AND monster_id = $2 
      GROUP BY user_id
    `;
    const values = [serverId, monsterId];

    const result = await client.query(query, values);
    return result.rows.map(row => ({
      user_id: row.user_id,
      total_damage: row.total_damage
    }));
  } catch (err) {
    console.error("❌ Error al calcular recompensas:", err);
    throw err;
  }
}

export async function limpiarRegistroCombate(serverId, monsterId) {
  try {
    const query = `
      DELETE FROM combat_log 
      WHERE server_id = $1 AND monster_id = $2
    `;
    const values = [serverId, monsterId];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al limpiar registros de combate:", err);
    throw err;
  }
}

export const calcularXPRequerida = nivel => Math.round(100 * nivel ** 1.5);

export async function actualizarRecompensas(userId, oroGanado, xpGanado, interaction) {
  try {
    // 🔹 Obtener datos del personaje
    const personaje = await getCharacterByUserId(userId);
    if (!personaje) return;

    let nuevaXP = personaje.xp + xpGanado;
    let nuevoNivel = personaje.nivel;
    let puntosStat = personaje.statpoints;
    let subioNivel = false;

    // 🔹 Comprobar si sube de nivel
    while (nuevaXP >= calcularXPRequerida(nuevoNivel)) {
      nuevaXP -= calcularXPRequerida(nuevoNivel);
      nuevoNivel++;
      puntosStat += 5; // 🔹 Agregar 5 puntos por nivel aumentado
      subioNivel = true;
    }

    // 🔹 Actualizar recompensas en la base de datos
    const query = `
      UPDATE characters 
      SET gold = gold + $1, xp = $2, nivel = $3, statpoints = $4 
      WHERE user_id = $5
    `;
    const values = [oroGanado, nuevaXP, nuevoNivel, puntosStat, userId];

    await client.query(query, values);

    // 🔹 Si el usuario subió de nivel, enviar mensaje privado
    if (subioNivel) {
      const user = await interaction.client.users.fetch(userId);
      if (user) {
        user.send(`✨ ¡Has subido de nivel! Ahora eres nivel **${nuevoNivel}** y has recibido **5 puntos de mejora**. Usa \`/asignar_puntos\` para mejorar tus estadísticas.`);
      }
    }

    return true;
  } catch (err) {
    console.error("❌ Error al actualizar recompensas del personaje:", err);
    throw err;
  }
}
