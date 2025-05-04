import { client } from './bd.js';

// 🔹 Obtener oro actual del usuario
export async function getUserGold(userId) {
  try {
    const query = "SELECT gold FROM characters WHERE user_id = $1";
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows[0]?.gold ?? 0; // Si el usuario no tiene oro, devuelve `0`
  } catch (err) {
    console.error("❌ Error al obtener oro del usuario:", err);
    throw err;
  }
}

// 🔹 Descontar oro después de la compra
export async function deductGold(userId, amount) {
  try {
    const query = "UPDATE characters SET gold = gold - $1 WHERE user_id = $2";
    const values = [amount, userId];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al descontar oro:", err);
    throw err;
  }
}

// 🔹 Agregar ítem al inventario
export async function addItemToInventory(userId, iditem, category) {
  try {
    const orderQuery = "SELECT MAX(item_order) AS maxOrder FROM inventory WHERE user_id = $1";
    const orderResult = await client.query(orderQuery, [userId]);
    const newOrder = (orderResult.rows[0]?.maxorder ?? 0) + 1;

    const query = `
      INSERT INTO inventory (user_id, iditem, category, item_order) 
      VALUES ($1, $2, $3, $4)
    `;
    const values = [userId, iditem, category, newOrder];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al agregar ítem al inventario:", err);
    throw err;
  }
}



// 🔹 Obtener el inventario de un usuario, ordenado por `item_order`
export async function getInventoryItems(userId) {
  try {
    const query = `
      SELECT iditem, category, item_order 
      FROM inventory 
      WHERE user_id = $1 
      ORDER BY item_order
    `;
    const values = [userId];

    const result = await client.query(query, values);
    return result.rows; // Devuelve lista de ítems
  } catch (err) {
    console.error("❌ Error al obtener inventario:", err);
    throw err;
  }
}

export async function removeItemFromInventory(userId, itemOrder) {
  try {
    const query = "DELETE FROM inventory WHERE user_id = $1 AND item_order = $2";
    const values = [userId, itemOrder];

    await client.query(query, values);
    return true;
  } catch (err) {
    console.error("❌ Error al eliminar ítem del inventario:", err);
    throw err;
  }
}

export async function obtenerItemPorOrden(userId, itemOrder) {
  try {
    const query = `
      SELECT iditem, category 
      FROM inventory 
      WHERE user_id = $1 AND item_order = $2
    `;
    const values = [userId, itemOrder];

    const result = await client.query(query, values);
    return result.rows[0] || null; // Devuelve el ítem si existe, o `null` si no hay resultado
  } catch (err) {
    console.error("❌ Error al obtener el ítem por orden:", err);
    throw err;
  }
}