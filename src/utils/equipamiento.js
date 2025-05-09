import { itemList } from "../data/items.js";

export function calcularStatsEquipados(equipamiento) {
  const statsTotales = {
    hp: 0,
    mana: 0,
    atkfisico: 0,
    deffisica: 0,
    atkmagico: 0,
    defmagica: 0,
    precision: 0,
    evasion: 0
  };

  equipamiento.forEach(equip => {
    // 🔹 Buscar el ítem en itemList según categoría e ID
    const categoria = itemList.find(c => c.category === equip.category);
    const item = categoria?.items.find(i => i.id === equip.iditem);

    if (item) {
      // 🔹 Sumar los valores de los stats
      statsTotales.hp += item.stats.hp;
      statsTotales.mana += item.stats.mana;
      statsTotales.atkfisico += item.stats.atkfisico;
      statsTotales.deffisica += item.stats.deffisica;
      statsTotales.atkmagico += item.stats.atkmagico;
      statsTotales.defmagica += item.stats.defmagica;
      statsTotales.precision += item.stats.precision;
      statsTotales.evasion += item.stats.evasion;
    }
  });

  return statsTotales;
}


