import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId, regenerarRecursos } from '../database/characters.js';
import { getEquippedItems } from '../database/equipment.js';
import { characters } from '../data/character.js';
import { itemList } from '../data/items.js';
import { calcularXPRequerida } from '../database/rewards.js';
import { actualizarTiempo, obtenerTiempo } from '../database/statics.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mi_personaje')
    .setDescription('Muestra las estadísticas y equipamiento de tu personaje.'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // 🔹 Buscamos al personaje en la base de datos
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({
        content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.",
        flags: MessageFlags.Ephemeral
      });
    }

    const tiempoUltimaRegen = await obtenerTiempo(userId, "lastRegen");
    if (Date.now() - tiempoUltimaRegen >= 60000) {
      await regenerarRecursos(userId);
      await actualizarTiempo(userId, "lastRegen");
    }

    const characterTemplate = characters.find(char => char.race === character.race);

    // 🔹 Buscamos los objetos equipados
    const equippedItems = await getEquippedItems(userId);

    const bonusStats = {
      hp: 0, mana: 0, atkFisico: 0, defFisica: 0,
      atkMagico: 0, defMagica: 0, presicion: 0, evasion: 0
    };

    equippedItems.forEach(({ idItem, category }) => {
      const itemData = itemList.find(cat => cat.category === category)
        ?.items.find(i => i.id === idItem);
      if (itemData) {
        Object.keys(bonusStats).forEach(stat => {
          bonusStats[stat] += itemData.stats[stat] || 0;
        });
      }
    });

    // 🔹 Estructura de los stats con bonus
    const formatStat = (base, bonus) => `${base} ${bonus > 0 ? `(+${bonus})` : ""}`;
    const xpRequerida = calcularXPRequerida(character.nivel)

    // 🔹 Embed con información del personaje
    const characterEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📜 Perfil de ${character.name}`)
      .setDescription(`Aquí están las estadísticas de tu personaje.`)
      .addFields(
        { name: "", value: `🧑‍🎤 Clase: **${character.race}**`, inline: false },
        { name: "", value: `🔹 Nivel: **${character.nivel}**`, inline: false },
        { name: "", value: `❤️ HP: **${formatStat(character.hp, bonusStats.hp)}/${character.hpMax}**`, inline: true },
        { name: "", value: `🔮 Mana: **${formatStat(character.mana, bonusStats.mana)}/${character.manaMax}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `⚔️ Atk. físico: **${formatStat(character.atkFisico, bonusStats.atkFisico)}**`, inline: true },
        { name: "", value: `🛡️ Def. física: **${formatStat(character.defFisica, bonusStats.defFisica)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔥 Atk. mágico: **${formatStat(character.atkMagico, bonusStats.atkMagico)}**`, inline: true },
        { name: "", value: `🔰 Def. mágica: **${formatStat(character.defMagica, bonusStats.defMagica)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🎯 Precisión: **${formatStat(character.presicion, bonusStats.presicion)}**`, inline: true },
        { name: "", value: `🌀 Evasión: **${formatStat(character.evasion, bonusStats.evasion)}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔹 Experiencia: **${character.xp} / ${xpRequerida}**`, inline: false },
        { name: "", value: `💰 Oro: **${character.gold}**`, inline: false },
        { name: "", value: `🧬 Elemento: **${character.elemento}**`, inline: false }
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
        mainHand: "Ninguno",
        offHand: "Ninguno"
      }
    };

    // 🔹 Organizamos los objetos equipados según `category` y `slot`
    equippedItems.forEach(({ idItem, category, slot }) => {
      const item = itemList.find(cat => cat.category === category)
        ?.items.find(i => i.id === idItem);
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

    return interaction.reply({ embeds: [characterEmbed, equipmentEmbed] });
  }
};
