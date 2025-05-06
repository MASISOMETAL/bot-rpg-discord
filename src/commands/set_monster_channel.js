import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { setMonsterChannel } from '../database/monster.js';

export default {
  data: new SlashCommandBuilder()
    .setName('set_monster_channel')
    .setDescription('Registra el canal donde aparecerán los monstruos.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('El canal donde aparecerán los monstruos.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const serverId = interaction.guild.id;
    const channel = interaction.options.getChannel('canal');

    if (!channel) {
      return interaction.reply({ content: "❌ Debes seleccionar un canal válido. o darle permisos para que el bot lo vea.", flags: MessageFlags.Ephemeral });
    }

    const success = await setMonsterChannel(serverId, channel.id);
    interaction.reply(success
      ? `✅ **El canal ${channel} ha sido registrado para la aparición de monstruos.**`
      : { content: "❌ Error al registrar el canal.", flags: MessageFlags.Ephemeral }
    );
  }
};
