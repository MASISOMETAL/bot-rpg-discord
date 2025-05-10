import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { actualizarHPMonstruo, eliminarMonstruo, obtenerDetallesMonstruo } from '../database/monster.js';
import { actualizarHPPersonaje, getCharacterByUserId } from '../database/characters.js';
import { skillsByRace } from '../data/skills.js';
import { calcularDaño } from '../utils/attacks.js';
import { getEquippedItems } from '../database/equipment.js';
import { monsters } from '../data/monsters.js';
import { actualizarRecompensas, calcularRecompensas, limpiarRegistroCombate, registrarAtaque } from '../database/rewards.js';
import { actualizarEstadisticas, actualizarTiempo, obtenerTiempo } from '../database/statics.js';
import { itemList } from '../data/items.js';
import { addItemToInventory } from '../database/inventory.js';
import { cooldownAttack } from '../../configs.js';
import { calcularStatsEquipados } from '../utils/equipamiento.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ataque')
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
    await interaction.deferReply();
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;
    const monster_id = interaction.options.getInteger('monster_id');
    const skillId = interaction.options.getInteger('skill_id');

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(String(userId));
    if (!character) {
      return interaction.editReply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    if (character.hp <= 0) {
      return interaction.editReply({ content: "❌ Estás fuera de combate. Debes esperar a recuperar vida o usar una curación antes de atacar nuevamente.", flags: MessageFlags.Ephemeral });
    }

    const tiempoUltimoAtaque = await obtenerTiempo(String(userId), "lastattack");

    if (!tiempoUltimoAtaque) {
      console.error("❌ Error: No se encontró `lastattack` en la base de datos.");
      return;
    }

    // 🔹 Convertimos `TIMESTAMP` a milisegundos y calculamos la diferencia de tiempo
    const tiempoTranscurridoAtk = Date.now() - tiempoUltimoAtaque.getTime();

    // 🔹 Calculamos los segundos restantes para el cooldown del ataque
    const tiempoRestante = Math.max(0, Math.ceil((cooldownAttack - tiempoTranscurridoAtk) / 1000));

    if (tiempoRestante > 0) {
      return interaction.editReply({
        content: `❌ Debes esperar 90 segundos antes de volver a atacar, quedan **${tiempoRestante}** segundos.`,
        flags: MessageFlags.Ephemeral
      });
    }

    // 🔹 Verificar que el monstruo existe y está activo
    const monstruoDB = await obtenerDetallesMonstruo(serverId, monster_id);
    if (!monstruoDB) {
      return interaction.editReply({ content: "❌ No hay un monstruo activo con ese ID.", flags: MessageFlags.Ephemeral });
    }

    const monstruoBase = monsters.find(m => m.id === monstruoDB.monster_id);

    const habilidadesDisponibles = (skillsByRace[character.race] || [])
      .filter(skill => skill.unlockLevel <= character.nivel);

    const habilidad = habilidadesDisponibles.find(skill => skill.id === skillId);

    if (!habilidad) {
      return interaction.editReply({ content: "❌ No puedes usar esa habilidad, no la has desbloqueado o no existe.", flags: MessageFlags.Ephemeral });
    }

    // 🔹 Espacio para los chequeos antes del cálculo de daño
    // ✅ Verificar mana suficiente
    // ✅ Comprobar precisión y evasión
    // ✅ Aplicar modificadores elementales
    // ✅ Manejar posibles estados alterados

    // 🔹 Cálculo de daño preliminar

    const equippedItems = await getEquippedItems(String(userId));
    const bonusStats = calcularStatsEquipados(equippedItems);

    let atacante = {
      ...character,
      hpmax: character.hpmax + bonusStats.hp,
      manamax: character.manamax + bonusStats.mana,
      atkfisico: character.atkfisico + bonusStats.atkfisico,
      deffisica: character.deffisica + bonusStats.deffisica,
      atkmagico: character.atkmagico + bonusStats.atkmagico,
      defmagica: character.defmagica + bonusStats.defmagica,
      precision: character.precision + bonusStats.precision,
      evasion: character.evasion + bonusStats.evasion,
      ataca: "Personaje"
    }

    let defensor = {
      ...monstruoBase.stats,
      nivel: monstruoBase.nivel
    }

    const damage = calcularDaño(atacante, defensor, habilidad)

    let newHP = monstruoDB.hp - damage.daño;
    const hpDeMob = newHP

    // 🔹 Actualizar HP del monstruo en la base de datos
    await actualizarHPMonstruo(serverId, monstruoBase.id, newHP);
    // 🔹 Guardamos el daño realizado en estadisticas
    await actualizarEstadisticas(String(userId), "totaldamage", damage.daño); // Daño causado
    // 🔹 Actualizarmos el tiempo para esperar 90 segundos
    await actualizarTiempo(String(userId), "lastattack"); // Actualiza el momento del ataque
    // 🔹 Vamos almacenando el daño para luego poder dar una recompensa
    await registrarAtaque(serverId, monstruoBase.id, String(userId), damage.daño);

    // 🔹 Si el monstruo sobrevive, contraataca
    if (newHP > 0) {
      let atacante = {
        ...monstruoBase.stats,
        nivel: monstruoBase.nivel,
        ataca: "Mob"
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
      await actualizarHPPersonaje(String(userId), newHP)

      const normalizeHabilidadType = {
        physical: "fisico",
        magical: "mágico"
      }

      return interaction.editReply({ content: `⚔️ Atacaste a **${monstruoBase.name}** con **${habilidad.name}**, ${damage.mensaje}. ¡El monstruo contraataco, ${damageMob.mensaje} con daño ${normalizeHabilidadType[habilidadMob.type]}, le queda **${hpDeMob}** de hp!` });
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
        const xpGanado = Math.round(total_damage * 0.02 * ajusteRecompensa); // 1% de recompensa

        await actualizarEstadisticas(String(userId), "monstersdefeated", 1); // Monstruo eliminado
        await actualizarRecompensas(user_id, oroGanado, xpGanado, interaction);

        // 🔹 Verificar si el usuario hizo más del 20% del daño total
        const porcentajeDanio = (total_damage / monstruoBase.hp) * 100;
        let mensajeRecompensa = `💀 El monstruo **${monstruoBase.name}** ha sido derrotado! 🎉\nHas ganado **${oroGanado} oro** y **${xpGanado} XP** por tu participación en la batalla.`;

        if (porcentajeDanio >= 10) {
          // 🔹 Definir si el drop sucede con un 30% de probabilidad
          if (Math.random() <= 0.6) {
            // 🔹 Elegir una categoría aleatoria
            const primerasCategorias = itemList.slice(0, 5);
            const categoriaRandom = primerasCategorias[Math.floor(Math.random() * primerasCategorias.length)].category;

            // 🔹 Obtener los ítems dentro de la categoría seleccionada
            const posiblesDrops = itemList.find(cat => cat.category === categoriaRandom)
              ?.items.filter(item => item.nivel >= nivelMonstruo && item.nivel <= nivelMonstruo + 10);

            if (posiblesDrops?.length > 0) { // 🔹 Verificamos que haya ítems disponibles
              const itemDrop = posiblesDrops[Math.floor(Math.random() * posiblesDrops.length)]; // 🔹 Seleccionamos un ítem aleatorio

              await addItemToInventory(String(user_id), itemDrop.id, categoriaRandom);
              mensajeRecompensa += `\n🎁 Además, has obtenido **${itemDrop.name}** como recompensa!`;
            }
          }
        }

        // 🔹 Enviar mensaje de recompensa al usuario
        const user = await interaction.client.users.fetch(user_id).catch(() => null);
        if (user) {
          try {
            await user.send(mensajeRecompensa);
          } catch (error) {
            console.error(`⚠️ No se pudo enviar DM a ${user.username}:`, error.message);
          }
        } else {
          console.error("❌ No se pudo obtener el usuario.");
        }
      }

      await limpiarRegistroCombate(serverId, monster_id); // 🔥 Limpiar registros
      return interaction.editReply({ content: `💀 Has derrotado a **${monstruoBase.name}** con **${habilidad.name}**, ${damage.mensaje}! 🎉` });
    }
  }
};
