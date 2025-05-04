import { client } from './bd.js';

// 🔹 Agregar un objeto al equipamiento en su slot correcto
export async function addItemToEquipment(userId, iditem, category, slot) {
  try {
    const query = `
      INSERT INTO equipment (user_id, iditem, category, slot) 
      VALUES ($1, $2, $3, $4)
    `;
    const values = [userId, iditem, category, slot];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al agregar objeto al equipamiento:", err);
    throw err;
  }
}

// 🔹 Eliminar un objeto del equipamiento para reemplazarlo
export async function removeItemFromEquipment(userId, slot) {
  try {
    const query = `
      DELETE FROM equipment 
      WHERE user_id = $1 AND slot = $2
    `;
    const values = [userId, slot];

    await client.query(query, values);

    return true;
  } catch (err) {
    console.error("❌ Error al eliminar objeto del equipamiento:", err);
    throw err;
  }
}


// 🔹 Obtener los ítems equipados sin procesar
export async function getEquippedItems(userId) {
  try {
    const query = `
      SELECT iditem, category, slot 
      FROM equipment 
      WHERE user_id = $1
    `;
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows; // Devuelve todos los ítems equipados en un array
  } catch (err) {
    console.error("❌ Error al obtener ítems equipados:", err);
    throw err;
  }
}
