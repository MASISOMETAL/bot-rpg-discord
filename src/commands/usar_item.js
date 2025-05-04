import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId, actualizarRecursos } from '../database/characters.js';
import { obtenerItemPorOrden, removeItemFromInventory } from '../database/inventory.js';
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
    const personaje = await getCharacterByUserId(userId);
    if (!personaje) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Obtener el ítem por su orden en el inventario
    const inventarioItem = await obtenerItemPorOrden(userId, itemOrder);
    if (!inventarioItem) {
      return interaction.reply({ content: "❌ No tienes un objeto en ese orden en tu inventario.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Validar que el ítem sea consumible
    const categoriaConsumibles = itemList.find(c => c.category === "Consumibles");
    const itemData = categoriaConsumibles?.items.find(i => i.id === inventarioItem.iditem);

    if (!itemData) {
      return interaction.reply({ content: "❌ No puedes usar este objeto, solo los consumibles pueden ser utilizados.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Aplicar efectos del ítem
    await actualizarRecursos(userId, itemData.stats.hp, itemData.stats.mana);

    // 🔹 Eliminar el ítem del inventario
    await removeItemFromInventory(userId, itemOrder);

    return interaction.reply({ content: `✅ Has usado **${itemData.name}** y recuperaste **${itemData.stats.hp} HP** y **${itemData.stats.mana} Mana**.`, flags: MessageFlags.Ephemeral });
  }
};
