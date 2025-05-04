import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getInventoryItems, removeItemFromInventory } from '../database/inventory.js';
import { getCharacterByUserId, updateCharacterGold } from '../database/characters.js';
import { itemList } from '../data/items.js';

export default {
  data: new SlashCommandBuilder()
    .setName('vender_item')
    .setDescription('Vende un objeto de tu inventario.')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID del objeto en tu inventario (item_order)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemOrder = interaction.options.getInteger('id');

    // 🔹 Verificamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem en el inventario
    const inventory = await getInventoryItems(userId);
    const inventoryItem = inventory.find(item => item.item_order === itemOrder);

    if (!inventoryItem) {
      return interaction.reply({ content: "❌ No tienes un objeto con ese ID en tu inventario.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem en `itemList`
    const itemData = itemList.find(cat => cat.category === inventoryItem.category)
      ?.items.find(i => i.id === inventoryItem.iditem);

    if (!itemData) {
      return interaction.reply({ content: "❌ No se encontró información sobre el objeto. Contacta a un administrador.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Verificamos si el ítem puede venderse
    if (!itemData.selleable) {
      return interaction.reply({ content: `❌ No puedes vender **${itemData.name}**. Este objeto no es comerciable.`, flags: MessageFlags.Ephemeral });
    }

    // 🔹 Calculamos el oro recibido (50% del precio)
    const goldReceived = Math.floor(itemData.coste * 0.5);

    // 🔹 Sumamos el oro al personaje
    await updateCharacterGold(userId, character.gold + goldReceived);

    // 🔹 Eliminamos el ítem del inventario
    await removeItemFromInventory(userId, itemOrder);

    // 🔹 Mensaje de confirmación
    return interaction.reply({
      content: `💰 Has vendido **${itemData.name}** por **${goldReceived}** de oro. Tu nuevo saldo es **${character.gold + goldReceived}**.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
