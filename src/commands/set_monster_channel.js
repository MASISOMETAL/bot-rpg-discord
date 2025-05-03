import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
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

    const success = await setMonsterChannel(serverId, channel.id);
    if (success) {
      interaction.reply(`✅ **El canal ${channel} ha sido registrado para la aparición de monstruos.**`);
    } else {
      interaction.reply({ content: "❌ Error al registrar el canal.", ephemeral: true });
    }
  }
};
