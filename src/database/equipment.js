import { db } from './bd.js';

// 🔹 Agregar un objeto al equipamiento en su slot correcto
async function addItemToEquipment(userId, idItem, category, slot) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO equipment (user_id, idItem, category, slot) VALUES (?, ?, ?, ?)",
      [userId, idItem, category, slot], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
  });
}

// 🔹 Eliminar un objeto del equipamiento para reemplazarlo
async function removeItemFromEquipment(userId, slot) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM equipment WHERE user_id = ? AND slot = ?", [userId, slot], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

// 🔹 Obtener los ítems equipados sin procesar
async function getEquippedItems(userId) {
  return new Promise((resolve, reject) => {
    db.all("SELECT idItem, category, slot FROM equipment WHERE user_id = ?", [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export { addItemToEquipment, removeItemFromEquipment, getEquippedItems };
