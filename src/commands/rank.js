import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { getCharacterByUserId, getTopCharacters, getUserRanking } from '../database/characters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Muestra el ranking de los personajes.')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Selecciona el ranking global o del servidor.')
        .setRequired(true)
        .addChoices(
          { name: '🌍 Global', value: 'global' },
          { name: '🏰 Servidor', value: 'server' }
        )),

  async execute(interaction) {
    const userId = interaction.user.id;
    const tipoRanking = interaction.options.getString('tipo');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(String(userId));
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    try {
      // 🔹 Obtener ranking global
      let ranking = await getTopCharacters(50);

      // 🔹 Filtrar si el usuario seleccionó "server"
      if (tipoRanking === 'server') {
        const members = await interaction.guild.members.fetch();
        const userIdsEnServidor = members.map(member => String(member.id));
        ranking = ranking.filter(char => userIdsEnServidor.includes(char.user_id));
      }

      if (!ranking || ranking.length === 0) {
        return interaction.reply({
          content: "❌ No se encontraron personajes registrados.",
          flags: MessageFlags.Ephemeral
        });
      }

      const userRanking = await getUserRanking(String(userId)) || "N/A";

      let currentPage = 0;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(ranking.length / itemsPerPage);

      function generateEmbed(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = ranking.slice(startIndex, endIndex);

        let description = "";
        pageItems.forEach((char, index) => {
          const rankingPosition = startIndex + index + 1;
          description += `**${rankingPosition}.** ${char.name} (${char.race}) - Nivel: ${char.nivel}, Exp: ${char.xp}\n`;
        });

        return new EmbedBuilder()
          .setTitle(`🏆 Ranking de Personajes - ${tipoRanking === "server" ? "Servidor" : "Global"} - Tu posición: #${userRanking}`)
          .setDescription(description + `\nPágina ${page + 1} de ${totalPages}`)
          .setColor("#ffd700")
          .setFooter({ text: "Ranking basado en Nivel y Experiencia" });
      }

      function generateButtons(page) {
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('⏪ Anterior')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('⏩ Siguiente')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages - 1)
        );
      }

      const response = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [generateButtons(currentPage)],
        flags: MessageFlags.Ephemeral
      });

      const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

      collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
          return i.reply({ content: "❌ Solo el iniciador del comando puede utilizar estos botones.", flags: MessageFlags.Ephemeral });
        }

        if (i.customId === 'prev' && currentPage > 0) {
          currentPage--;
        } else if (i.customId === 'next' && currentPage < totalPages - 1) {
          currentPage++;
        }

        await i.update({
          embeds: [generateEmbed(currentPage)],
          components: [generateButtons(currentPage)]
        });
      });

    } catch (error) {
      console.error("❌ Error en el comando /rank:", error);
      return interaction.reply({
        content: "❌ Ocurrió un error al generar el ranking.",
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
