import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { getInventoryItems } from '../database/inventory.js';
import { getCharacterByUserId } from '../database/characters.js';
import { itemList } from '../data/items.js';

export default {
  data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('Muestra los objetos de tu inventario.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({
        content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.",
        flags: MessageFlags.Ephemeral
      });
    }

    const inventory = await getInventoryItems(userId);       

    if (inventory.length === 0) {
      return interaction.reply({ content: "❌ No tienes objetos en tu inventario.", flags: MessageFlags.Ephemeral });
    }

    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(inventory.length / itemsPerPage);

    function generateEmbed(page) {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = inventory.slice(start, end);

      return new EmbedBuilder()
        .setColor('#ffcc00')
        .setTitle("🎒 Inventario")
        .setDescription(`Página ${page + 1} de ${totalPages}`)
        .addFields(
          ...pageItems.map(item => {            
            const foundItem = itemList.find(cat => cat.category === item.category)
                                      ?.items.find(i => i.id === item.iditem);
            return {
              name: ``,
              value: `ID ${item.item_order} - 🔹 ${foundItem ? foundItem.name : "❌ No encontrado"}`,
              inline: false
            };
          })
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

    const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row] });

    const pageCollector = message.createMessageComponentCollector({ time: 60000 });

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
