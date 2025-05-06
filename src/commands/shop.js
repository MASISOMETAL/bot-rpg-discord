import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { itemList } from '../data/items.js';
import { getCharacterByUserId } from '../database/characters.js';

const nameFormated = {
  Helms: "Cascos",
  Armors: "Armaduras",
  Pants: "Pantalones",
  Gloves: "Guantes",
  Boots: "Botas",
  Weapons: "Armas",
  Consumibles: "Consumibles"
}

export default {
  data: new SlashCommandBuilder()
    .setName('tienda')
    .setDescription('Explora la tienda por categoría.')
    .addStringOption(option =>
      option.setName('categoria')
        .setDescription('Elige una categoría')
        .setRequired(true)
        .addChoices(
          ...itemList.map(category => ({ name: nameFormated[category.category], value: category.category }))
        )),

  async execute(interaction) {
    const selectedCategory = interaction.options.getString('categoria');
    const userId = interaction.user.id;

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({
        content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.",
        flags: MessageFlags.Ephemeral
      });
    }

    const items = itemList.find(cat => cat.category === selectedCategory)?.items.filter(item => item.nivel < 10)|| [];

    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    function generateEmbed(page) {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = items.slice(start, end);

      return new EmbedBuilder()
        .setColor('#ffcc00')
        .setTitle(`🛒 Tienda - ${selectedCategory}`)
        .setDescription(`Página ${page + 1} de ${totalPages}`)
        .addFields(
          ...pageItems.map(item => ({
            name: ``,
            value: `🔹 ID: ${item.id} - **${item.name}** - 💰 ${item.coste} Oro`,
            inline: false
          }))
        );
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('⏪ Anterior')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('⏩ Siguiente')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === totalPages - 1)
    );

    const shopMessage = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row], flags: MessageFlags.Ephemeral });

    const pageCollector = shopMessage.createMessageComponentCollector({ time: 60000 });

    pageCollector.on('collect', async i => {
      if (i.customId === 'previous' && currentPage > 0) {
        currentPage--;
      } else if (i.customId === 'next' && currentPage < totalPages - 1) {
        currentPage++;
      }

      await i.update({
        embeds: [generateEmbed(currentPage)],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('previous')
              .setLabel('⏪ Anterior')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId('next')
              .setLabel('⏩ Siguiente')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === totalPages - 1)
          )
        ]
      });
    });
  }
};
