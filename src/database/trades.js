import { client } from "./bd.js";

export async function iniciarTrade(usuario1, usuario2) {
  const query = `INSERT INTO trades (usuario1, usuario2) VALUES ($1, $2) RETURNING id`;
  const values = [usuario1, usuario2];
  const result = await client.query(query, values);
  return result.rows[0].id;
}

export async function agregarItemATrade(tradeId, userId, iditem) {
  const query = `INSERT INTO trade_items (trade_id, user_id, iditem) VALUES ($1, $2, $3)`;
  await client.query(query, [tradeId, userId, iditem]);
}

export async function aceptarTrade(tradeId, userId) {
  const query = `UPDATE trades SET estado = 'aceptado' WHERE id = $1 AND (usuario1 = $2 OR usuario2 = $2)`;
  await client.query(query, [tradeId, userId]);
}

export async function cancelarTrade(tradeId) {
  const query = `DELETE FROM trades WHERE id = $1`;
  await client.query(query, [tradeId]);
}
