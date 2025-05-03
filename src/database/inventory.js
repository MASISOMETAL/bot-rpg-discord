import { db } from './bd.js';
import { itemList } from '../data/items.js';

// 🔹 Obtener oro actual del usuario
async function getUserGold(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT gold FROM characters WHERE user_id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.gold : 0);
    });
  });
}

// 🔹 Descontar oro después de la compra
async function deductGold(userId, amount) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE characters SET gold = gold - ? WHERE user_id = ?", [amount, userId], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

// 🔹 Agregar ítem al inventario
async function addItemToInventory(userId, idItem, category) {
  return new Promise((resolve, reject) => {
    db.get("SELECT MAX(item_order) AS maxOrder FROM inventory WHERE user_id = ?", [userId], (err, row) => {
      if (err) return reject(err);

      const newOrder = (row?.maxOrder ?? 0) + 1;

      db.run("INSERT INTO inventory (user_id, idItem, category, item_order) VALUES (?, ?, ?, ?)",
        [userId, idItem, category, newOrder], (err) => {
          if (err) reject(err);
          else resolve(true);
        });
    });
  });
}


// 🔹 Obtener el inventario de un usuario, ordenado por `item_order`
async function getInventoryItems(userId) {
  return new Promise((resolve, reject) => {
    db.all("SELECT idItem, category, item_order FROM inventory WHERE user_id = ? ORDER BY item_order", [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// 🔹 Eliminar un ítem del inventario por `item_order`
async function removeItemFromInventory(userId, itemOrder) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM inventory WHERE user_id = ? AND item_order = ?", [userId, itemOrder], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

export async function obtenerItemPorOrden(userId, itemOrder) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT idItem, category FROM inventory WHERE user_id = ? AND item_order = ?",
      [userId, itemOrder],
      function (err, row) {
        if (err) {
          console.error("❌ Error al obtener el ítem por orden:", err);
          return reject(err);
        }
        resolve(row || null);
      }
    );
  });
}


export { getUserGold, addItemToInventory, deductGold, getInventoryItems, removeItemFromInventory };
