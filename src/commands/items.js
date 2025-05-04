import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { itemList } from '../data/items.js';
import { getCharacterByUserId } from '../database/characters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('items')
    .setDescription('Explora los artefactos y objetos disponibles en el mundo.')
    .addStringOption(option =>
      option.setName('categoria')
        .setDescription('Elige la categoría de objetos a explorar.')
        .setRequired(true)
        .addChoices(
          ...itemList.map(category => ({ name: category.category, value: category.category }))
        )
    )
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID del objeto a inspeccionar en detalle.')
        .setRequired(false)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const categoria = interaction.options.getString('categoria');
    const itemId = interaction.options.getInteger('id');
    const categoriaData = itemList.find(cat => cat.category === categoria);

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    if (!categoriaData || !categoriaData.items.length) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(0xff0000).setTitle("Error").setDescription(`❌ No hay objetos disponibles en la categoría **${categoria}**.`)],
        flags: MessageFlags.Ephemeral
      });
    }

    if (itemId) {
      const itemData = categoriaData.items.find(item => item.id === itemId);
      if (!itemData) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0xff0000).setTitle("Error").setDescription(`❌ No se encontró un objeto con el ID **${itemId}** en **${categoria}**.`)],
          flags: MessageFlags.Ephemeral
        });
      }

      const itemEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`📜 ${itemData.name}`)
        .setDescription(`🏷️ **ID:** ${itemData.id}\n💰 **Precio:** ${itemData.coste} oro\n🛡️ **Usable por:** ${itemData.usableBy.join(', ')}\n📖 **Descripción:** "${itemData.description}"`)
        .addFields(
          { name: "⚔️ Atributos", value: `HP: ${itemData.stats.hp}\nMana: ${itemData.stats.mana}\nAtaque Físico: ${itemData.stats.atkfisico}\nDefensa Física: ${itemData.stats.deffisica}\nAtaque Mágico: ${itemData.stats.atkmagico}\nDefensa Mágica: ${itemData.stats.defmagica}\nPrecisión: ${itemData.stats.precision}\nEvasión: ${itemData.stats.evasion}`, inline: true },
          { name: "🛒 Comerciable", value: itemData.selleable ? "✅ Sí" : "❌ No", inline: true }
        );

      return interaction.reply({ embeds: [itemEmbed], flags: MessageFlags.Ephemeral });
    } else {
      const itemsPerPage = 10;
      const totalPages = Math.ceil(categoriaData.items.length / itemsPerPage);
      let currentPage = 0;

      const generateEmbed = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = categoriaData.items.slice(start, end);

        return new EmbedBuilder()
          .setColor(0x0000ff)
          .setTitle(`📖 Objetos en ${categoria} (Página ${page + 1}/${totalPages})`)
          .setDescription(`Utiliza el comando /items [categoria] [id] para ver sus detalles`)
          .addFields(
            ...pageItems.map(item => ({
              name: ``,
              value: `ID: ${item.id} - **${item.name}**`,
              inline: false
            }))
          );
      };

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

      const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row], flags: MessageFlags.Ephemeral });

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
  }
};
