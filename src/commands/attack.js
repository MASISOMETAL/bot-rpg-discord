import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { actualizarHPMonstruo, eliminarMonstruo, obtenerDetallesMonstruo } from '../database/monster.js';
import { actualizarHPPersonaje, getCharacterByUserId, regenerarRecursos } from '../database/characters.js';
import { skillsByRace } from '../data/skills.js';
import { calcularDaño } from '../utils/attacks.js';
import { getEquippedItems } from '../database/equipment.js';
import { monsters } from '../data/monsters.js';
import { actualizarRecompensas, calcularRecompensas, limpiarRegistroCombate, registrarAtaque } from '../database/rewards.js';
import { actualizarEstadisticas, actualizarTiempo, obtenerTiempo } from '../database/statics.js';
import { itemList } from '../data/items.js';
import { addItemToInventory } from '../database/inventory.js';
import { cooldownAttack, cooldownRestoreHP } from '../../configs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('attack')
    .setDescription('Ataca a un monstruo con una habilidad.')
    .addIntegerOption(option =>
      option.setName('monster_id')
        .setDescription('ID del monstruo que quieres atacar.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('skill_id')
        .setDescription('ID de la habilidad que usarás.')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;
    const monster_id = interaction.options.getInteger('monster_id');
    const skillId = interaction.options.getInteger('skill_id');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    const tiempoUltimaRegen = await obtenerTiempo(userId, "lastRegen");
    if (Date.now() - tiempoUltimaRegen >= cooldownRestoreHP) {
      await regenerarRecursos(userId);
      await actualizarTiempo(userId, "lastRegen");
    }

    if (character.hp <= 0) {
      return interaction.reply({ content: "❌ Estás fuera de combate. Debes esperar a recuperar vida o usar una curación antes de atacar nuevamente.", flags: MessageFlags.Ephemeral });
    }

    const tiempoUltimoAtaque = await obtenerTiempo(userId, "lastAttack");
    const tiempoRestante = Math.ceil((cooldownAttack - (Date.now() - tiempoUltimoAtaque)) / 1000); // 🔹 Calculamos los segundos restantes

    if (tiempoRestante > 0) {
      return interaction.reply({
        content: `❌ Debes esperar 90 segundos antes de volver a atacar, quedan **${tiempoRestante}** segundos.`,
        flags: MessageFlags.Ephemeral
      });
    }

    // 🔹 Verificar que el monstruo existe y está activo
    const monstruoDB = await obtenerDetallesMonstruo(serverId, monster_id);
    if (!monstruoDB) {
      return interaction.reply({ content: "❌ No hay un monstruo activo con ese ID.", flags: MessageFlags.Ephemeral });
    }

    const monstruoBase = monsters.find(m => m.id === monstruoDB.monster_id);

    const habilidadesDisponibles = (skillsByRace[character.race] || [])
      .filter(skill => skill.unlockLevel <= character.nivel);

    const habilidad = habilidadesDisponibles.find(skill => skill.id === skillId);

    if (!habilidad) {
      return interaction.reply({ content: "❌ No puedes usar esa habilidad, no la has desbloqueado o no existe.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Espacio para los chequeos antes del cálculo de daño
    // ✅ Verificar mana suficiente
    // ✅ Comprobar precisión y evasión
    // ✅ Aplicar modificadores elementales
    // ✅ Manejar posibles estados alterados

    // 🔹 Cálculo de daño preliminar

    let atacante = {
      ...character
    }

    let defensor = {
      ...monstruoBase.stats,
      nivel: monstruoBase.nivel
    }

    const damage = calcularDaño(atacante, defensor, habilidad)

    let newHP = monstruoDB.hp - damage.daño;

    // 🔹 Actualizar HP del monstruo en la base de datos
    await actualizarHPMonstruo(serverId, monstruoBase.id, newHP);
    // 🔹 Guardamos el daño realizado en estadisticas
    await actualizarEstadisticas(userId, "totalDamage", damage.daño); // Daño causado
    // 🔹 Actualizarmos el tiempo para esperar 90 segundos
    await actualizarTiempo(userId, "lastAttack"); // Actualiza el momento del ataque
    // 🔹 Vamos almacenando el daño para luego poder dar una recompensa
    await registrarAtaque(serverId, monstruoBase.id, userId, damage.daño);

    // 🔹 Si el monstruo sobrevive, contraataca
    if (newHP > 0) {
      let atacante = {
        ...monstruoBase.stats,
        nivel: monstruoBase.nivel
      }

      let defensor = {
        ...character
      }

      const habilidadMob = {
        type: Math.random() < 0.5 ? "physical" : "magical",
        damage: 120
      }

      const damageMob = calcularDaño(atacante, defensor, habilidadMob)

      newHP = character.hp - damageMob.daño;

      // actualizar hp del personaje
      await actualizarHPPersonaje(userId, newHP)

      return interaction.reply({ content: `⚔️ Atacaste a **${monstruoBase.name}** con **${habilidad.name}**, ${damage.mensaje}. ¡El monstruo contraataco, ${damageMob.mensaje} con daño ${habilidadMob.type}!` });
    } else {
      // 🔹 Si el monstruo muere

      await eliminarMonstruo(serverId, monster_id);
      const recompensas = await calcularRecompensas(serverId, monster_id);

      // 🔹 Aplicar oro y experiencia a cada usuario
      for (const { user_id, total_damage } of recompensas) {
        const personaje = await getCharacterByUserId(user_id);
        if (!personaje) continue;

        // 🔹 Calcular diferencia de nivel
        const nivelMonstruo = monstruoBase.nivel;
        const nivelJugador = personaje.nivel;
        const diferenciaNivel = Math.abs(nivelJugador - nivelMonstruo) + 1;

        // 🔹 Ajuste según la diferencia de nivel
        const ajusteRecompensa = nivelJugador < nivelMonstruo ? diferenciaNivel : 1 / diferenciaNivel;

        // 🔹 Calcular recompensas ajustadas
        const oroGanado = Math.round(total_damage * 0.05 * ajusteRecompensa); // 5% de recompensa
        const xpGanado = Math.round(total_damage * 0.01 * ajusteRecompensa); // 1% de recompensa

        await actualizarEstadisticas(userId, "monstersDefeated", 1); // Monstruo eliminado
        await actualizarRecompensas(user_id, oroGanado, xpGanado, interaction);

        // 🔹 Verificar si el usuario hizo más del 20% del daño total
        const porcentajeDanio = (total_damage / monstruoBase.hp) * 100;
        let mensajeRecompensa = `💀 **El monstruo ${monstruoBase.name} ha sido derrotado!** 🎉\nHas ganado **${oroGanado} oro** y **${xpGanado} XP** por tu participación en la batalla.`;

        if (porcentajeDanio >= 20) {
          // 🔹 Definir si el drop sucede con un 30% de probabilidad
          if (Math.random() <= 0.3) {
            // 🔹 Obtener lista de ítems en el rango de nivel permitido
            const posiblesDrops = itemList.flatMap(category => category.items)
              .filter(item => item.nivel >= nivelMonstruo && item.nivel <= nivelMonstruo + 2);

            // 🔹 Seleccionar un ítem al azar
            const itemDrop = posiblesDrops[Math.floor(Math.random() * posiblesDrops.length)];

            if (itemDrop) {
              await addItemToInventory(user_id, itemDrop.id, itemDrop.category);
              mensajeRecompensa += `\n🎁 Además, has obtenido **${itemDrop.name}** como recompensa!`;
            }
          }
        }

        // 🔹 Enviar mensaje de recompensa al usuario
        const user = await interaction.client.users.fetch(user_id);
        if (user) {
          user.send(mensajeRecompensa);
        }
      }

      await limpiarRegistroCombate(serverId, monster_id); // 🔥 Limpiar registros
      console.log("🔹 Recompensas calculadas:", recompensas);
      return interaction.reply({ content: `💀 Has derrotado a **${monstruoBase.name}** con **${habilidad.name}**! 🎉` });
    }
  }
};
