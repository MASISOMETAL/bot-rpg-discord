import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';
import { getStatisticsByUserId } from '../database/statics.js';

export default {
  data: new SlashCommandBuilder()
    .setName('estadisticas')
    .setDescription('Muestra las estadísticas de tu personaje.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // 🔹 Validamos si el usuario tiene un personaje
    const character = await getCharacterByUserId(String(userId));
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Obtener estadísticas del usuario
    const stats = await getStatisticsByUserId(String(userId));
    if (!stats) {
      return interaction.reply({ content: "❌ No tienes estadísticas registradas aún. ¡Empieza a combatir!", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Embed con estadísticas
    const statsEmbed = new EmbedBuilder()
      .setColor('#ffaa00')
      .setTitle(`📊 Estadísticas de ${interaction.user.username}`)
      .setDescription("Aquí puedes ver tu progreso en el juego.")
      .addFields(
        { name: "", value: `💀 Monstruos derrotados: ${stats.monstersdefeated}`, inline: false },
        { name: "", value: `⚔️ Daño total causado: ${stats.totaldamage}`, inline: false }
      )
      .setThumbnail(interaction.user.displayAvatarURL());

    return interaction.reply({ embeds: [statsEmbed] });
  }
};
