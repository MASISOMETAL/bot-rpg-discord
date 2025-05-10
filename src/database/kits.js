import { client } from "./bd.js";

// Función para comprobar si el usuario ya canjeó un kit determinado
export async function checkKitRedemption(userId, kitCode) {
  try {
    const query = `
      SELECT * FROM kit_redemptions
      WHERE user_id = $1 AND kit_code = $2
    `;
    const values = [userId, kitCode];
    const { rows } = await client.query(query, values);
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error("❌ Error al verificar redención del kit:", error);
    throw error;
  }
}

// Función para registrar que el usuario canjeó un kit
export async function insertKitRedemption(userId, kitCode) {
  try {
    const query = `
      INSERT INTO kit_redemptions (user_id, kit_code)
      VALUES ($1, $2)
    `;
    const values = [String(userId), kitCode];
    await client.query(query, values);
    return true;
  } catch (error) {
    console.error("❌ Error al registrar redención del kit:", error);
    throw error;
  }
}
