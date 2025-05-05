import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getEquippedItems, removeItemFromEquipment } from '../database/equipment.js';
import { addItemToInventory } from '../database/inventory.js';
import { itemList } from '../data/items.js';
import { modificarStatsPersonaje } from '../database/characters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('desequipar_item')
    .setDescription('Quita un objeto equipado y lo mueve al inventario.')
    .addStringOption(option =>
      option.setName('slot')
        .setDescription('Elige el slot del ítem a desequipar.')
        .setRequired(true)
        .addChoices(
          { name: "Cabeza", value: "Helms" },
          { name: "Pecho", value: "Armors" },
          { name: "Piernas", value: "Pants" },
          { name: "Brazos", value: "Gloves" },
          { name: "Pies", value: "Boots" },
          { name: "Mano Derecha", value: "mainHand" },
          { name: "Mano Izquierda", value: "offHand" }
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const slot = interaction.options.getString('slot');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.editReply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem equipado en el slot indicado
    const equippedItems = await getEquippedItems(userId);
    const equippedItem = equippedItems.find(item => item.slot === slot);

    const slotMessages = {
      Helms: "Cabeza",
      Armors: "Pecho",
      Pants: "Piernas",
      Gloves: "Brazos",
      Boots: "Pies",
      mainHand: "Mano Derecha",
      offHand: "Mano Izquierda"
    }

    if (!equippedItem) {
      return interaction.reply({ content: `❌ No tienes ningún objeto equipado en **${slotMessages[slot]}**.`, flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem en `itemList`
    const itemData = itemList.find(cat => cat.category === equippedItem.category)
      ?.items.find(i => i.id === equippedItem.iditem);

    if (!itemData) {
      return interaction.reply({ content: "❌ No se encontró información sobre el objeto. Contacta a un administrador.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Movemos el ítem al inventario
    await addItemToInventory(userId, equippedItem.iditem, equippedItem.category);

    // 🔹 Modificar los stats del usuario
    await modificarStatsPersonaje(userId, itemData.stats, "restar")

    // 🔹 Eliminamos el ítem del equipo
    await removeItemFromEquipment(userId, slot);

    // 🔹 Mensaje de resultado
    return interaction.reply({
      content: `🛡️ Has desequipado **${itemData.name}** y ahora está en tu inventario.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
