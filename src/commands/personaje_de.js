import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId, regenerarRecursos } from '../database/characters.js';
import { getEquippedItems } from '../database/equipment.js';
import { characters } from '../data/character.js';
import { itemList } from '../data/items.js';
import { calcularXPRequerida } from '../database/rewards.js';
import { actualizarTiempo, obtenerTiempo } from '../database/statics.js';

export default {
  data: new SlashCommandBuilder()
    .setName('personaje_de')
    .setDescription('Muestra las estadísticas y equipamiento del personaje de un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario cuyo personaje deseas ver')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Obtenemos el usuario objetivo a partir de la opción y su id
    const targetUser = interaction.options.getUser('usuario');
    const targetUserId = targetUser.id;

    // Buscar el personaje del usuario mencionado
    const character = await getCharacterByUserId(String(targetUserId));
    if (!character) {
      return interaction.reply({
        content: `❌ El usuario ${targetUser} no tiene un personaje creado. Pídele que use \`/crear_personaje\` para comenzar su aventura.`,
        flags: MessageFlags.Ephemeral
      });
    }

    // Se busca la imagen base de plantilla para el personaje, según su raza
    const characterTemplate = characters.find(char => char.race === character.race);

    // Obtener los objetos equipados
    const equippedItems = await getEquippedItems(String(targetUserId));
    const bonusStats = {
      hp: 0, mana: 0, atkfisico: 0, deffisica: 0,
      atkmagico: 0, defmagica: 0, precision: 0, evasion: 0
    };

    equippedItems.forEach(({ iditem, category }) => {
      const itemData = itemList.find(cat => cat.category === category)
        ?.items.find(i => i.id === iditem);
      if (itemData) {
        Object.keys(bonusStats).forEach(stat => {
          bonusStats[stat] += itemData.stats[stat] || 0;
        });
      }
    });

    // Función auxiliar para formatear las estadísticas, añadiendo bonus
    const formatStat = (base, bonus) => `${base}${bonus > 0 ? ` (+${bonus})` : ""}`;
    const xpRequerida = calcularXPRequerida(character.nivel);

    // Definir emojis para los elementos
    const elementEmojis = {
      "Fuego": "🔥",
      "Viento": "💨",
      "Oscuridad": "🌑",
      "Tierra": "🍃",
      "Agua": "💧"
    };
    const elementoEmoji = elementEmojis[character.elemento] || "❓";

    // Armado del embed con la información de las estadísticas
    const characterEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📜 Perfil de ${character.name} (de ${targetUser.username})`)
      .setDescription(`Estas son las estadísticas de su personaje.`)
      .addFields(
        { name: "", value: `🧑‍🎤 Clase: **${character.race}**`, inline: false },
        { name: "", value: `🔹 Nivel: **${character.nivel}**`, inline: false },
        { name: "", value: `❤️ HP: **${character.hp}/${character.hpmax}**`, inline: true },
        { name: "", value: `🔮 Mana: **${character.mana}/${character.manamax}**`, inline: true },
        { name: "", value: "", inline: false },
        { name: "", value: `⚔️ Atk. físico: **${formatStat(character.atkfisico, bonusStats.atkfisico)}**`, inline: true },
        { name: "", value: `🛡️ Def. física: **${formatStat(character.deffisica, bonusStats.deffisica)}**`, inline: true },
        { name: "", value: "", inline: false },
        { name: "", value: `🔥 Atk. mágico: **${formatStat(character.atkmagico, bonusStats.atkmagico)}**`, inline: true },
        { name: "", value: `🔰 Def. mágica: **${formatStat(character.defmagica, bonusStats.defmagica)}**`, inline: true },
        { name: "", value: "", inline: false },
        { name: "", value: `🎯 Precisión: **${formatStat(character.precision, bonusStats.precision)}**`, inline: true },
        { name: "", value: `🌀 Evasión: **${formatStat(character.evasion, bonusStats.evasion)}**`, inline: true },
        { name: "", value: "", inline: false },
        { name: "", value: `🔹 Experiencia: **${character.xp} / ${xpRequerida}**`, inline: false },
        { name: "", value: `💰 Oro: **${character.gold}**`, inline: false },
        { name: "", value: `🧬 Elemento: ${elementoEmoji} **${character.elemento}**`, inline: false }
      )
      .setThumbnail(characterTemplate?.img);

    // Organizar el equipamiento
    const equippedSlots = {
      Helms: "Ninguno",
      Armors: "Ninguno",
      Pants: "Ninguno",
      Gloves: "Ninguno",
      Boots: "Ninguno",
      Weapons: {
        mainHand: "Puño",
        offHand: "Puño"
      }
    };

    equippedItems.forEach(({ iditem, category, slot }) => {
      const item = itemList.find(cat => cat.category === category)
        ?.items.find(i => i.id === iditem);
      if (item) {
        if (category === "Weapons") {
          equippedSlots.Weapons[slot] = item.name;
        } else {
          equippedSlots[category] = item.name;
        }
      }
    });

    // Embed con la información del equipamiento
    const equipmentEmbed = new EmbedBuilder()
      .setColor('#ff8800')
      .setTitle(`⚔️ Equipamiento de ${character.name}`)
      .setDescription("Estos son los artículos que lleva puesto.")
      .addFields(
        { name: "🪖 Cabeza", value: equippedSlots.Helms, inline: false },
        { name: "👕 Pecho", value: equippedSlots.Armors, inline: false },
        { name: "🩳 Piernas", value: equippedSlots.Pants, inline: false },
        { name: "🦾 Brazos", value: equippedSlots.Gloves, inline: false },
        { name: "🥾 Pies", value: equippedSlots.Boots, inline: false },
        { name: "🗡️ Mano Derecha", value: equippedSlots.Weapons.mainHand, inline: false },
        { name: "🛡️ Mano Izquierda", value: equippedSlots.Weapons.offHand, inline: false }
      );

    return interaction.reply({
      embeds: [characterEmbed, equipmentEmbed],
      flags: MessageFlags.Ephemeral
    });
  }
};
