import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { obtenerMonstruosActivos, obtenerDetallesMonstruo } from '../database/monster.js';
import { monsters } from '../data/monsters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('monster')
    .setDescription('Ver monstruos activos o detalles de uno específico.')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID del monstruo para ver detalles.')
        .setRequired(false)),

  async execute(interaction) {
    const serverId = interaction.guild.id;
    const monsterId = interaction.options.getInteger('id');

    if (monsterId) {
      // 🔹 Obtener detalles de un monstruo específico
      const monstruoActivo = await obtenerDetallesMonstruo(serverId, monsterId);
      if (!monstruoActivo) {
        return interaction.reply({ content: "❌ No hay un monstruo activo con ese ID.", flags: MessageFlags.Ephemeral });
      }

      // 🔹 Obtener datos adicionales desde `monsters.js`
      const monstruoData = monsters.find(m => m.id === monsterId);
      if (!monstruoData) {
        return interaction.reply({ content: "❌ No se encontraron detalles del monstruo en la base de datos.", flags: MessageFlags.Ephemeral });
      }

      // 🔹 Embed detallado
      const monsterEmbed = new EmbedBuilder()
        .setColor('#ff3333')
        .setTitle(`📜 ${monstruoData.name} - ID: ${monstruoData.id}`)
        .setDescription(`Detalles del monstruo activo nivel ${monstruoData.nivel}.`)
        .addFields(
          { name: "", value: `❤️ HP: **${monstruoActivo.hp}** / ${monstruoData.stats.hp}`, inline: true },
          { name: "", value: ``, inline: false },
          { name: "", value: `⚔️ Atk. físico: **${monstruoData.stats.atkfisico}**`, inline: true },
          { name: "", value: `🛡️ Def. física: **${monstruoData.stats.deffisica}**`, inline: true },
          { name: "", value: ``, inline: false },
          { name: "", value: `🔥 Atk. mágico: **${monstruoData.stats.atkmagico}**`, inline: true },
          { name: "", value: `🔰 Def. mágica: **${monstruoData.stats.defmagica}**`, inline: true },
          { name: "", value: ``, inline: false },
          { name: "", value: `🎯 Precisión: **${monstruoData.stats.precision}**`, inline: true },
          { name: "", value: `🌀 Evasión: **${monstruoData.stats.evasion}**`, inline: true },
          { name: "", value: ``, inline: false },
          { name: "", value: `🧬 Elemento: **${monstruoActivo.element}**`, inline: false }
        )
        .setThumbnail(monstruoData.image)

      return interaction.reply({ embeds: [monsterEmbed] });
    }

    // 🔹 Obtener lista de monstruos activos
    const monstruosActivos = await obtenerMonstruosActivos(serverId);
    if (!monstruosActivos.length) {
      return interaction.reply({ content: "❌ No hay monstruos activos en este servidor.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Paginación
    let currentPage = 0;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(monstruosActivos.length / itemsPerPage);

    function generateEmbed(page) {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const pageMonsters = monstruosActivos.slice(start, end);

      return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🐉 Monstruos Activos en ${interaction.guild.name}`)
        .setDescription(`Página ${page + 1} de ${totalPages}`)
        .addFields(
          ...pageMonsters.map(monstruo => ({
            name: ``,
            value: `📜ID ${monstruo.monster_id} - ${monsters.find(m => m.id === monstruo.monster_id)?.name || "Desconocido"} - ❤️ HP: **${monstruo.hp}** / ${monsters.find(m => m.id === monstruo.monster_id)?.stats.hp || "Desconocido"}`,
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

    const monsterMessage = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row] });

    const pageCollector = monsterMessage.createMessageComponentCollector({ time: 60000 });

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
