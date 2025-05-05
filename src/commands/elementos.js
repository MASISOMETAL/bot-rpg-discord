import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';

export default {
  data: new SlashCommandBuilder()
    .setName('elementos')
    .setDescription('Muestra las fortalezas y debilidades de los elementos en combate.'),

  async execute(interaction) {

    const userId = interaction.user.id;

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.editReply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    const embed = new EmbedBuilder()
      .setTitle("Tabla de Fortalezas y Debilidades Elementales")
      .setDescription("Cada elemento tiene ventajas y desventajas en combate. Es fuerte contra un tipo y aún más fuerte contra otro, mientras que es débil ante un tercero y extremadamente vulnerable frente a un cuarto.")
      .setImage("https://i.ibb.co/JR0rk0xQ/elementos.png")
      .setColor(0x3498db);

    await interaction.reply({ embeds: [embed] });
  }
};
