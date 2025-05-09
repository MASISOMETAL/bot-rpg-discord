import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';
import { getInventoryItems, removeItemFromInventory, addItemToInventory } from '../database/inventory.js';
import { getEquippedItems, addItemToEquipment, removeItemFromEquipment } from '../database/equipment.js';
import { itemList } from '../data/items.js';

export default {
  data: new SlashCommandBuilder()
    .setName('equipar_item')
    .setDescription('Equipa un objeto de tu inventario.')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID del objeto en tu inventario (item_order)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemOrder = interaction.options.getInteger('id');

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(String(userId));
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Obtenemos el inventario del usuario
    const inventory = await getInventoryItems(String(userId));
    const inventoryItem = inventory.find(item => item.item_order === itemOrder);

    if (!inventoryItem) {
      return interaction.reply({ content: "❌ No tienes un objeto con ese ID en tu inventario.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Verificamos si el objeto es consumible antes de equiparlo
    if (inventoryItem.category === "Consumibles") {
      return interaction.reply({ content: "❌ Los ítems consumibles no pueden ser equipados. Usa `/usar_item` para consumirlos.", flags: MessageFlags.Ephemeral });
    }

    if (inventoryItem.category === "Box") {
      return interaction.reply({ content: "❌ Los ítems Box no pueden ser equipados. Usa `/usar_item` para abrirlos.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem en `itemList`
    const selectedItem = itemList.find(cat => cat.category === inventoryItem.category)
      ?.items.find(i => i.id === inventoryItem.iditem);

    if (!selectedItem) {
      return interaction.reply({ content: "❌ No se encontró el objeto en la lista de ítems. Contacta a un administrador.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Verificamos si el personaje puede usar el objeto
    if (!selectedItem.usableBy.includes(character.race)) {
      return interaction.reply({ content: `❌ No puedes equipar **${selectedItem.name}** porque no es compatible con tu raza.`, flags: MessageFlags.Ephemeral });
    }

    // 🔹 Definimos el `slot` según `category`
    let slot = inventoryItem.category;
    let previouslyEquipped = null;
    let replacedItems = [];

    // 🔹 Manejo especial para armas
    const equippedItems = await getEquippedItems(String(userId));
    if (inventoryItem.category === "Weapons") {
      const mainHandOccupied = equippedItems.some(e => e.slot === "mainHand");
      const offHandOccupied = equippedItems.some(e => e.slot === "offHand");

      if (!selectedItem.onehand) {
        const mainHandItem = equippedItems.find(item => item.slot === "mainHand");
        const offHandItem = equippedItems.find(item => item.slot === "offHand");

        // 🔹 Restamos los stats de las armas equipadas antes de eliminarlas
        if (mainHandItem) {
          const mainHandData = itemList.find(cat => cat.category === mainHandItem.category)
            ?.items.find(i => i.id === mainHandItem.iditem);
          await addItemToInventory(String(userId), mainHandItem.iditem, mainHandItem.category);
          previouslyEquipped = mainHandItem;
        }

        if (offHandItem) {
          const offHandData = itemList.find(cat => cat.category === offHandItem.category)
            ?.items.find(i => i.id === offHandItem.iditem);
          await addItemToInventory(String(userId), offHandItem.iditem, offHandItem.category);
          replacedItems.push(offHandItem);
        }

        await removeItemFromEquipment(String(userId), "mainHand");
        await removeItemFromEquipment(String(userId), "offHand");

        slot = "mainHand";
      } else {
        if (!mainHandOccupied) {
          slot = "mainHand";
        } else if (!offHandOccupied) {
          const mainHandItem = equippedItems.find(item => item.slot === "mainHand");
          const mainHandData = itemList.find(cat => cat.category === mainHandItem.category)
            ?.items.find(i => i.id === mainHandItem.iditem);

          if (mainHandData && !mainHandData.onehand) {
            await addItemToInventory(String(userId), mainHandItem.iditem, mainHandItem.category);
            await removeItemFromEquipment(String(userId), "mainHand");
            previouslyEquipped = mainHandItem;
            slot = "mainHand";
          } else {
            slot = "offHand";
          }
        } else {
          previouslyEquipped = equippedItems.find(item => item.slot === "mainHand");
          await removeItemFromEquipment(String(userId), "mainHand");
          slot = "mainHand";
        }
      }
    } else {
      previouslyEquipped = equippedItems.find(e => e.slot === slot);

      if (previouslyEquipped) {
        const prevItemData = itemList.find(cat => cat.category === previouslyEquipped.category)
          ?.items.find(i => i.id === previouslyEquipped.iditem);

        await addItemToInventory(String(userId), previouslyEquipped.iditem, previouslyEquipped.category);
        await removeItemFromEquipment(String(userId), slot);
      }
    }

    // 🔹 Equipamos el nuevo objeto
    await addItemToEquipment(String(userId), selectedItem.id, inventoryItem.category, slot);

    // 🔹 Eliminamos el ítem del inventario
    await removeItemFromInventory(String(userId), itemOrder);

    const slotMessages = {
      Helms: "Cabeza",
      Armors: "Pecho",
      Pants: "Piernas",
      Gloves: "Brazos",
      Boots: "Pies",
      mainHand: "Mano Derecha",
      offHand: "Mano Izquierda"
    };

    // 🔹 Mensaje de resultado
    let message = `✅ Has equipado **${selectedItem.name}** en **${slotMessages[slot]}**.`;
    if (previouslyEquipped) {
      const prevName = itemList.find(cat => cat.category === previouslyEquipped.category)
        ?.items.find(i => i.id === previouslyEquipped.iditem)?.name || "Objeto desconocido";
      message += ` 🔄 Se ha guardado **${prevName}** en tu inventario.`;
    }

    return interaction.reply({ content: message, flags: MessageFlags.Ephemeral });
  }
};
