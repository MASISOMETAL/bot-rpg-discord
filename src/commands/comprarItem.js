import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getUserGold, addItemToInventory, deductGold } from '../database/inventory.js';
import { getCharacterByUserId } from '../database/characters.js';
import { itemList } from '../data/items.js';

export default {
  data: new SlashCommandBuilder()
    .setName('comprar_item')
    .setDescription('Compra un objeto de la tienda.')
    .addStringOption(option =>
      option.setName('categoria')
        .setDescription('Elige una categoría')
        .setRequired(true)
        .addChoices(
          ...itemList.map(category => ({ name: category.category, value: category.category }))
        ))
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID del objeto dentro de la categoría seleccionada')
        .setRequired(true)),

  async execute(interaction) {
    const selectedCategory = interaction.options.getString('categoria');
    const itemId = interaction.options.getInteger('id');
    const userId = interaction.user.id;

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({
        content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.",
        flags: MessageFlags.Ephemeral
      });
    }

    // 🔹 Buscamos la categoría
    const category = itemList.find(cat => cat.category === selectedCategory);
    if (!category) {
      return interaction.reply({ content: "❌ La categoría ingresada es inválida. Intenta nuevamente.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Buscamos el ítem dentro de la categoría seleccionada
    const item = category.items.find(i => i.id === itemId);
    if (!item) {
      return interaction.reply({ content: "❌ El ID del objeto es inválido dentro de la categoría. Intenta nuevamente.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Verificamos que el ítem sea de nivel menor a 10
    if (item.nivel >= 10) {
      return interaction.reply({ content: `❌ **${item.name}** no se vende en el mercado.`, flags: MessageFlags.Ephemeral });
    }

    // 🔹 Obtenemos el oro actual del usuario
    const userGold = await getUserGold(userId);
    if (userGold < item.coste) {
      return interaction.reply({ content: `❌ No tienes suficiente oro. Necesitas ${item.coste} oro para comprar **${item.name}**.`, flags: MessageFlags.Ephemeral });
    }

    // 🔹 Realizamos la transacción
    await deductGold(userId, item.coste);
    await addItemToInventory(userId, item.id, selectedCategory);

    return interaction.reply({ content: `✅ Has comprado **${item.name}** por 💰 ${item.coste} oro.` });
  }
};
