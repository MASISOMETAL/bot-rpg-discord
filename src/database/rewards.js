import { db } from "./bd.js";
import { getCharacterByUserId } from "./characters.js";

export async function registrarAtaque(serverId, monsterId, userId, damage) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO combat_log (server_id, monster_id, user_id, damage) VALUES (?, ?, ?, ?)`,
      [serverId, monsterId, userId, damage],
      function (err) {
        if (err) {
          console.error("❌ Error al registrar el ataque:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export async function calcularRecompensas(serverId, monsterId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT user_id, SUM(damage) AS total_damage FROM combat_log WHERE server_id = ? AND monster_id = ? GROUP BY user_id`,
      [serverId, monsterId],
      function (err, rows) {
        if (err) {
          console.error("❌ Error al calcular recompensas:", err);
          return reject(err);
        }

        resolve(rows.map(row => ({
          user_id: row.user_id,
          total_damage: row.total_damage
        })));
      }
    );
  });
}

export async function limpiarRegistroCombate(serverId, monsterId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM combat_log WHERE server_id = ? AND monster_id = ?`,
      [serverId, monsterId],
      function (err) {
        if (err) {
          console.error("❌ Error al limpiar registros de combate:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

// export async function actualizarRecompensas(userId, oroGanado, xpGanado) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `UPDATE characters SET gold = gold + ?, xp = xp + ? WHERE user_id = ?`,
//       [oroGanado, xpGanado, userId],
//       function (err) {
//         if (err) {
//           console.error("❌ Error al actualizar recompensas del personaje:", err);
//           return reject(err);
//         }
//         resolve();
//       }
//     );
//   });
// }

export const calcularXPRequerida = nivel => Math.round(100 * nivel ** 1.5);

export async function actualizarRecompensas(userId, oroGanado, xpGanado, interaction) {
  const personaje = await getCharacterByUserId(userId);
  if (!personaje) return;

  let nuevaXP = personaje.xp + xpGanado;
  let nuevoNivel = personaje.nivel;
  let puntosStat = personaje.statPoints;
  let subioNivel = false;

  while (nuevaXP >= calcularXPRequerida(nuevoNivel)) {
    nuevaXP -= calcularXPRequerida(nuevoNivel);
    nuevoNivel++;
    puntosStat += 5; // 🔹 Agregar 5 puntos por nivel aumentado
    subioNivel = true;
  }

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE characters SET gold = gold + ?, xp = ?, nivel = ?, statPoints = ? WHERE user_id = ?`,
      [oroGanado, nuevaXP, nuevoNivel, puntosStat, userId],
      async function (err) {
        if (err) {
          console.error("❌ Error al actualizar recompensas del personaje:", err);
          return reject(err);
        }
        // 🔹 Si el usuario subió de nivel, enviar un mensaje privado
        if (subioNivel) {
          const user = await interaction.client.users.fetch(userId);
          if (user) {
            user.send(`✨ ¡Has subido de nivel! Ahora eres nivel **${nuevoNivel}** y has recibido **5 puntos de mejora**. Usa \`/asignar_puntos\` para mejorar tus estadísticas.`);
          }
        }
        resolve();
      }
    );
  });
}
