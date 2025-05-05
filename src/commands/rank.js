import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { getTopCharacters, getUserRanking } from '../database/characters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Muestra el ranking de los 50 mejores personajes.'),

  async execute(interaction) {

    const userId = interaction.user.id;

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.editReply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    try {
      // Obtenemos los 50 mejores personajes de la base de datos
      const ranking = await getTopCharacters(50);

      if (!ranking || ranking.length === 0) {
        return interaction.reply({
          content: "❌ No se encontraron personajes registrados.",
          flags: MessageFlags.Ephemeral
        });
      }
      const userRanking = await getUserRanking(userId);

      let currentPage = 0;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(ranking.length / itemsPerPage);

      // Función para generar un embed según la página actual
      function generateEmbed(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = ranking.slice(startIndex, endIndex);

        // Armamos la lista de ranking
        let description = "";
        pageItems.forEach((char, index) => {
          const rankingPosition = startIndex + index + 1;
          description += `**${rankingPosition}.** ${char.name} (${char.race}) - Nivel: ${char.nivel}, Exp: ${char.xp}\n`;
        });

        return new EmbedBuilder()
          .setTitle(`🏆 Ranking de Personajes - Tu posición: #${userRanking ? userRanking : "N/A"}`)
          .setDescription(description + `\nPágina ${page + 1} de ${totalPages}`)
          .setColor("#ffd700")
          .setFooter({ text: "Ranking basado en Nivel y Experiencia" });
      }

      // Creamos los botones para la paginación
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

      // Enviamos el mensaje inicial con la primera página
      const response = await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: [generateButtons(currentPage)],
        ephemeral: true
      });

      // Creamos el colector para los botones, restringiendo la interacción al usuario que ejecutó el comando
      const collector = response.createMessageComponentCollector({ time: 60000 });

      collector.on('collect', async (i) => {
        // Restringe la interacción al usuario que ejecutó el comando
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
