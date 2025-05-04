import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { createCharacter, getCharacterByUserId } from '../database/characters.js';
import { characters } from '../data/character.js';
import { elements } from '../data/elements.js';

export default {
  data: new SlashCommandBuilder()
    .setName('crear_personaje')
    .setDescription('Crea un nuevo personaje para comenzar tu aventura.')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('El nombre de tu personaje')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raza')
        .setDescription('Elige una raza: Guerrero, Mago, Arquero')
        .setRequired(true)
        .addChoices(
          { name: 'Guerrero', value: 'Guerrero' },
          { name: 'Mago', value: 'Mago' },
          { name: 'Arquero', value: 'Arquero' }
        )),

  async execute(interaction) {
    const userId = interaction.user.id;
    const name = interaction.options.getString('nombre');
    const race = interaction.options.getString('raza');

    // 🔹 Verificamos si el usuario ya tiene un personaje registrado
    const existingCharacter = await getCharacterByUserId(userId);
    if (existingCharacter) {
      return interaction.reply({
        content: `❌ Ya tienes un personaje registrado como **${existingCharacter.name}** (${existingCharacter.race}). No puedes crear otro.`,
        flags: MessageFlags.Ephemeral
      });
    }

    // 🔹 Obtenemos los stats base de `characters.js`
    const characterTemplate = characters.find(char => char.race === race);
    if (!characterTemplate) {
      return interaction.reply({ content: "❌ Raza inválida. Inténtalo nuevamente.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Asignamos un elemento aleatorio
    const randomElement = elements[Math.floor(Math.random() * elements.length)];

    // 🔹 Creamos el objeto con los datos del personaje
    const characterData = {
      user_id: userId,
      name,
      race,
      nivel: characterTemplate.nivel,
      xp: characterTemplate.xp,
      hp: characterTemplate.stats.hp,
      hpmax: characterTemplate.stats.hp,
      mana: characterTemplate.stats.mana,
      manamax: characterTemplate.stats.mana,
      atkfisico: characterTemplate.stats.atkfisico,
      deffisica: characterTemplate.stats.deffisica,
      atkmagico: characterTemplate.stats.atkmagico,
      defmagica: characterTemplate.stats.defmagica,
      precision: characterTemplate.stats.precision,
      evasion: characterTemplate.stats.evasion,
      gold: characterTemplate.gold,
      elemento: randomElement
    };

    // 🔹 Guardamos el personaje en la base de datos
    const success = await createCharacter(characterData);
    if (!success) {
      return interaction.reply({ content: "❌ Hubo un error al crear tu personaje. Inténtalo nuevamente.", flags: MessageFlags.Ephemeral });
    }

    const elementEmojis = {
      "Fuego": "🔥",
      "Viento": "💨",
      "Oscuridad": "🌑",
      "Tierra": "🍃",
      "Agua": "💧"
    };

    const elementoEmoji = elementEmojis[characterData.elemento] || "❓"; // Usa un emoji de pregunta si el elemento no está definido
    // 🔹 Embed con estadísticas del personaje
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`¡${name} ha sido creado! 🎉`)
      .setDescription(`Un nuevo aventurero ha nacido en el reino.`)
      .addFields(
        { name: "", value: `🧑‍🎤 Clase: **${race}**`, inline: false },
        { name: "", value: `🔹 Nivel: **${characterData.nivel}**`, inline: false },
        { name: "", value: `❤️ HP: **${characterData.hp}/${characterData.hpmax}**`, inline: true },
        { name: "", value: `🔮 Mana: **${characterData.mana}/${characterData.manamax}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `⚔️ Atk. físico: **${characterData.atkfisico}**`, inline: true },
        { name: "", value: `🛡️ Def. física: **${characterData.deffisica}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔥 Atk. mágico: **${characterData.atkmagico}**`, inline: true },
        { name: "", value: `🔰 Def. mágica: **${characterData.defmagica}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🎯 Precisión: **${characterData.precision}**`, inline: true },
        { name: "", value: `🌀 Evasión: **${characterData.evasion}**`, inline: true },
        { name: "", value: ``, inline: false },
        { name: "", value: `🔹 Experiencia: **${characterData.xp}**`, inline: false },
        { name: "", value: `💰 Oro: **${characterData.gold}**`, inline: false },
        { name: "", value: `🧬 Elemento: ${elementoEmoji} **${characterData.elemento}**`, inline: false }
      )
      .setThumbnail(characterTemplate.img);

    // 🔹 Enviamos el embed al canal para que todos lo vean
    await interaction.channel.send({ embeds: [embed] });

    // 🔹 Mensaje privado para el usuario confirmando su creación
    return interaction.reply({
      content: `✅ Tu personaje **${name}** ha sido creado con éxito.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
