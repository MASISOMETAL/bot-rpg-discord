import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId, actualizarRecursos } from '../database/characters.js';
import { addItemToInventory, obtenerItemPorOrden, removeItemFromInventory } from '../database/inventory.js';
import { itemList } from '../data/items.js';

export default {
  data: new SlashCommandBuilder()
    .setName('usar_item')
    .setDescription('Usa un objeto de tu inventario.')
    .addIntegerOption(option =>
      option.setName('item_order')
        .setDescription('Número de orden del objeto en tu inventario.')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemOrder = interaction.options.getInteger('item_order');

    // 🔹 Verificar existencia del personaje
    const personaje = await getCharacterByUserId(String(userId));
    if (!personaje) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Obtener el ítem por su orden en el inventario
    const inventarioItem = await obtenerItemPorOrden(String(userId), itemOrder);
    if (!inventarioItem) {
      return interaction.reply({ content: "❌ No tienes un objeto en ese orden en tu inventario.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Validar la categoría permitida
    const itemData = itemList.find(cat => cat.category === inventarioItem.category)
      ?.items.find(i => i.id === inventarioItem.iditem);

    console.log("🧐 Debug itemData:", itemData);
    if (!itemData) {
      return interaction.reply({ content: "❌ Hubo un error al obtener los datos del objeto. Verifica que exista en la lista de ítems.", flags: MessageFlags.Ephemeral });
    }


    if (!itemData || !["Consumibles", "Box"].includes(inventarioItem.category)) {
      return interaction.reply({ content: "❌ No puedes usar este objeto, solo los **Consumibles** y **Cajas** pueden ser utilizados.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Aplicar efectos según el tipo de ítem
    if (inventarioItem.category === "Consumibles") {
      await actualizarRecursos(String(userId), itemData.stats.hp, itemData.stats.mana);
      await removeItemFromInventory(String(userId), itemOrder);
      return interaction.reply({ content: `✅ Has usado **${itemData.name}** y recuperaste **${itemData.stats.hp} HP** y **${itemData.stats.mana} Mana**.`, flags: MessageFlags.Ephemeral });
    }

    if (inventarioItem.category === "Box") {
      // 🔹 Filtrar ítems dentro del rango de nivel permitido
      const posiblesDrops = itemList.flatMap(category => category.items)
        .filter(item => item.nivel >= itemData.nivel_min && item.nivel <= itemData.nivel_max)
        .filter(item => !["Consumibles", "Box"].includes(item.category)); // 🔹 Excluir Consumibles y Box

      if (!posiblesDrops.length) {
        return interaction.reply({ content: "❌ No hay ítems disponibles en esta caja.", flags: MessageFlags.Ephemeral });
      }

      // 🔹 Elegir un ítem aleatorio dentro del rango válido
      const itemDrop = posiblesDrops[Math.floor(Math.random() * posiblesDrops.length)];
      const categoriaObjeto = itemList.find(cat => cat.items.some(i => i.id === itemDrop.id));
      const categoriaFinal = categoriaObjeto ? categoriaObjeto.category : "Desconocido";

      await addItemToInventory(String(userId), itemDrop.id, categoriaFinal);
      await removeItemFromInventory(String(userId), itemOrder);

      return interaction.reply({ content: `🎁 Has abierto una **${itemData.name}** y obtenido **${itemDrop.name}**!`, flags: MessageFlags.Ephemeral });
    }
  }
};
