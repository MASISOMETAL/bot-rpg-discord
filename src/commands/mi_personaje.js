import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';
import { getEquippedItems } from '../database/equipment.js';
import { characters } from '../data/character.js';
import { itemList } from '../data/items.js';
import { calcularXPRequerida } from '../database/rewards.js';
import { calcularStatsEquipados } from '../utils/equipamiento.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mi_personaje')
    .setDescription('Muestra las estadísticas y equipamiento de tu personaje.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // 🔹 Buscamos al personaje en la base de datos
    let character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({
        content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.",
        flags: MessageFlags.Ephemeral
      });
    }

    const characterTemplate = characters.find(char => char.race === character.race);

    // 🔹 Buscamos los objetos equipados
    const equippedItems = await getEquippedItems(userId);

    // 🔹 Unificamos todos los stats en uno
    const bonusStats = calcularStatsEquipados(equippedItems)

    // 🔹 Estructura de los stats con bonus
    const formatStat = (base, bonus) => `${base + bonus} ${bonus > 0 ? `(+${bonus})` : ""}`;
    const xpRequerida = calcularXPRequerida(character.nivel)

    const elementEmojis = {
      "Fuego": "🔥",
      "Viento": "💨",
      "Oscuridad": "🌑",
      "Tierra": "🍃",
      "Agua": "💧"
    };

    const elementoEmoji = elementEmojis[character.elemento] || "❓"; // Usa un emoji de pregunta si el elemento no está definido

    // 🔹 Embed con información del personaje
    const characterEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📜 Perfil de ${character.name}`)
      .setDescription(`Aquí están las estadísticas de tu personaje.`)
      .addFields(
        { name: "", value: `🧑‍🎤 Clase: **${character.race}**`, inline: false },
        { name: "", value: `🔹 Nivel: **${character.nivel}**`, inline: true },
        { name: "", value: `🔹 Puntos: **${character.statpoints}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `❤️ HP: **${character.hp}/${character.hpmax}**`, inline: true },
        { name: "", value: `🔮 Mana: **${character.mana}/${character.manamax}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `⚔️ Atk. físico: **${formatStat(character.atkfisico, bonusStats.atkfisico)}**`, inline: true },
        { name: "", value: `🛡️ Def. física: **${formatStat(character.deffisica, bonusStats.deffisica)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔥 Atk. mágico: **${formatStat(character.atkmagico, bonusStats.atkmagico)}**`, inline: true },
        { name: "", value: `🔰 Def. mágica: **${formatStat(character.defmagica, bonusStats.defmagica)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🎯 Precisión: **${formatStat(character.precision, bonusStats.precision)}**`, inline: true },
        { name: "", value: `🌀 Evasión: **${formatStat(character.evasion, bonusStats.evasion)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔹 Experiencia: **${character.xp} / ${xpRequerida}**`, inline: false },
        { name: "", value: `💰 Oro: **${character.gold}**`, inline: false },
        { name: "", value: `🧬 Elemento: ${elementoEmoji} **${character.elemento}**`, inline: false }
      )
      .setThumbnail(characterTemplate.img);

    // 🔹 Estructura predeterminada de los slots
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

    // 🔹 Organizamos los objetos equipados según `category` y `slot`
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

    // 🔹 Embed con información del equipamiento
    const equipmentEmbed = new EmbedBuilder()
      .setColor('#ff8800')
      .setTitle(`⚔️ Equipamiento de ${character.name}`)
      .setDescription("Aquí está el equipo que llevas puesto.")
      .addFields(
        { name: "🪖 Cabeza", value: equippedSlots.Helms, inline: false },
        { name: "👕 Pecho", value: equippedSlots.Armors, inline: false },
        { name: "🩳 Piernas", value: equippedSlots.Pants, inline: false },
        { name: "🦾 Brazos", value: equippedSlots.Gloves, inline: false },
        { name: "🥾 Pies", value: equippedSlots.Boots, inline: false },
        { name: "🗡️ Mano Derecha", value: equippedSlots.Weapons.mainHand, inline: false },
        { name: "🛡️ Mano Izquierda", value: equippedSlots.Weapons.offHand, inline: false }
      );

    return interaction.reply({ embeds: [characterEmbed, equipmentEmbed], flags: MessageFlags.Ephemeral });
  }
};
