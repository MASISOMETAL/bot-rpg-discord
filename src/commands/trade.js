import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { client } from '../database/bd.js';
import { iniciarTrade, verificarTradeActivo } from '../database/trades.js';

export default {
  data: new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Inicia un intercambio con otro jugador.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Jugador con el que quieres intercambiar ítems.')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const usuarioObjetivo = interaction.options.getUser('usuario');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    if (!usuarioObjetivo) {
      return interaction.reply({ content: "❌ Debes seleccionar un jugador para intercambiar.", flags: MessageFlags.Ephemeral });
    }

    const objetivoId = usuarioObjetivo.id;

    // 🔹 Verificar si alguno ya tiene un trade pendiente
    const tradeActivo1 = await verificarTradeActivo(userId);
    const tradeActivo2 = await verificarTradeActivo(objetivoId);

    if (tradeActivo1 || tradeActivo2) {
      return interaction.reply({ content: "❌ Uno de los jugadores ya tiene un intercambio pendiente. Finaliza o cancela antes de iniciar otro.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Crear intercambio en la base de datos
    const tradeId = await iniciarTrade(userId, objetivoId);

    return interaction.reply({ content: `🔹 **${interaction.user.username}** ha iniciado un trade con **${usuarioObjetivo.username}**!\nUsen \`/trade_offer [id]\` para agregar ítems.`, flags: MessageFlags.None });
  }
};
