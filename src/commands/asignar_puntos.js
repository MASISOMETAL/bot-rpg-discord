import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { actualizarStat, getCharacterByUserId } from '../database/characters.js';
import { statMultipliers } from '../data/character.js';

export default {
  data: new SlashCommandBuilder()
    .setName('asignar_puntos')
    .setDescription('Distribuye tus puntos de mejora en las estadísticas de tu personaje.')
    .addStringOption(option =>
      option.setName('stat')
        .setDescription('Stat que quieres mejorar.')
        .setRequired(true)
        .addChoices(
          { name: 'HP', value: 'hp' },
          { name: 'Mana', value: 'mana' },
          { name: 'Atk Físico', value: 'atkfisico' },
          { name: 'Def Física', value: 'deffisica' },
          { name: 'Atk Mágico', value: 'atkmagico' },
          { name: 'Def Mágica', value: 'defmagica' },
          { name: 'Precisión', value: 'precision' },
          { name: 'Evasión', value: 'evasion' }
        ))
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de puntos a asignar.')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const stat = interaction.options.getString('stat');
    const cantidad = interaction.options.getInteger('cantidad');

    const personaje = await getCharacterByUserId(String(userId));
    if (!personaje) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    if (cantidad <= 0) {
      return interaction.reply({
        content: "❌ La cantidad de puntos debe ser un número positivo.",
        flags: MessageFlags.Ephemeral
      });
    }

    if (cantidad > personaje.statpoints) {
      return interaction.reply({ content: `❌ No tienes suficientes puntos de mejora. Te quedan **${personaje.statpoints}** puntos disponibles.`, flags: MessageFlags.Ephemeral });
    }

    const multiplicador = statMultipliers[personaje.race]?.[stat] || 1;
    const incremento = cantidad * multiplicador;

    await actualizarStat(String(userId), stat, incremento, cantidad);

    return interaction.reply({ content: `✅ Has asignado **${cantidad} puntos** a **${stat}**, aumentando su valor en **${incremento}**.`, flags: MessageFlags.Ephemeral });
  }
};
