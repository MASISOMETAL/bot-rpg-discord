import { obtenerNivelUsuario } from '../database/characters.js';
import { verificarCanalMonstruo, incrementarMensaje, obtenerMensajeCount, reiniciarMensajeCount, verificarMonstruoActivo, agregarMonstruoActivo } from '../database/monster.js';
import { EmbedBuilder } from 'discord.js';
import { seleccionarMonstruoAleatorio } from '../utils/monster.js';
import { maxMessage, minMessage, porcentajeDeAparicion } from '../../configs.js';

export default async function messagesHandler(message) {
  if (message.author.bot) return; // Ignorar mensajes de bots

  const serverId = message.guild?.id;
  const channelId = message.channel?.id;
  const userId = message.author?.id;
  const nivelUsuario = await obtenerNivelUsuario(userId);

  // 🔹 Verificar si el canal donde se escribió está registrado
  const canalRegistrado = await verificarCanalMonstruo(serverId);
  if (!canalRegistrado) return;

  const responseChannel = message.guild.channels.cache.get(canalRegistrado);

  const monsterSpawn = seleccionarMonstruoAleatorio(nivelUsuario);

  const { monster, randomElement } = monsterSpawn

  if (!monster) {
    console.error("❌ Error: 'monster' es null o undefined.");
    return;
  }

  // 🔹 Verificar existencia antes de incrementar el contador
  const yaExiste = await verificarMonstruoActivo(serverId, monster?.id);
  if (yaExiste) return; // 🔹 Si ya hay uno, no generar otro

  // 🔹 Incrementar contador de mensajes
  await incrementarMensaje(serverId);

  // 🔹 Obtener contador de mensajes actual
  const mensajeCount = await obtenerMensajeCount(serverId);

  // 🔹 Validar aparición de monstruo
  if (mensajeCount >= maxMessage || (mensajeCount >= minMessage && Math.random() * 100 < porcentajeDeAparicion)) {

    const elementEmojis = {
      "Fuego": "🔥",
      "Viento": "💨",
      "Oscuridad": "🌑",
      "Tierra": "🍃",
      "Agua": "💧"
    };

    const elementoEmoji = elementEmojis[randomElement] || "❓"; // Usa un emoji de pregunta si el elemento no está definido
    // 🔹 Embed con información del personaje
    const monsterEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📜 ${monster.name} - ID: ${monster?.id}`)
      .setDescription(`Un monstruo de **nivel ${monster.nivel}** ha aparecido!.`)
      .addFields(
        { name: "", value: `❤️ HP: **${monster.stats.hp}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `⚔️ Atk. físico: **${monster.stats.atkfisico}**`, inline: true },
        { name: "", value: `🛡️ Def. física: **${monster.stats.deffisica}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔥 Atk. mágico: **${monster.stats.atkmagico}**`, inline: true },
        { name: "", value: `🔰 Def. mágica: **${monster.stats.defmagica}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🎯 Precisión: **${monster.stats.precision}**`, inline: true },
        { name: "", value: `🌀 Evasión: **${monster.stats.evasion}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🧬 Elemento: ${elementoEmoji} **${randomElement}**`, inline: false }
      )
      .setThumbnail(monster.image);

    await responseChannel.send({ embeds: [monsterEmbed] });
    await agregarMonstruoActivo(serverId, monster?.id, monster.stats.hp, randomElement);
    await reiniciarMensajeCount(serverId);

    // 🔹 Reiniciamos contador
  }
}
