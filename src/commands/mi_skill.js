import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';
import { skillsByRace } from '../data/skills.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mis_habilidades')
    .setDescription('Muestra tus habilidades disponibles según tu nivel.')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID de la habilidad que deseas ver')
        .setRequired(false)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const skillId = interaction.options.getInteger('id');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    const skills = skillsByRace[character.race] || [];

    if (skillId) {
      // 🔹 Mostrar detalle de habilidad específica
      const skill = skills.find(s => s.id === skillId);
      if (!skill || skill.unlockLevel > character.nivel) {
        return interaction.reply({ content: `❌ No tienes acceso a la habilidad con ID ${skillId}.`, flags: MessageFlags.Ephemeral });
      }

      const skillEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📜 Habilidad - ${skill.name}`)
        .setDescription(`Detalles de la habilidad`)
        .addFields(
          { name: "", value: `🆔 ID - ${skill.id}`, inline: false },
          { name: "", value: `⚡ Tipo - ${skill.type}`, inline: false },
          { name: "", value: `💥 Daño - ${skill.damage}`, inline: false },
          { name: "", value: `🔮 Costo de mana - ${skill.manaCost}`, inline: false },
          { name: "", value: `⚡ Efecto - ${skill.effect ? `${skill.effect} (${skill.effectChance}%)` : "Ninguno"}`, inline: false }
        );

      return interaction.reply({ embeds: [skillEmbed], flags: MessageFlags.Ephemeral });
    }

    // 🔹 Mostrar todas las habilidades accesibles con paginación
    const availableSkills = skills.filter(s => s.unlockLevel <= character.nivel);
    if (availableSkills.length === 0) {
      return interaction.reply({ content: "❌ Aún no tienes habilidades disponibles.", flags: MessageFlags.Ephemeral });
    }

    let currentPage = 0;
    const skillsPerPage = 5;
    const totalPages = Math.ceil(availableSkills.length / skillsPerPage);

    function generateEmbed(page) {
      const start = page * skillsPerPage;
      const end = start + skillsPerPage;
      const pageSkills = availableSkills.slice(start, end);

      return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle("📜 Habilidades Disponibles")
        .setDescription(`Página ${page + 1} de ${totalPages}`)
        .addFields(
          ...pageSkills.map(skill => ({
            name: `✨ **${skill.name}**`,
            value: `🆔 ID: ${skill.id} - ⚔️ Daño: ${skill.damage}`,
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

    const skillMessage = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row], flags: MessageFlags.Ephemeral });

    const pageCollector = skillMessage.createMessageComponentCollector({ time: 60000 });

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
