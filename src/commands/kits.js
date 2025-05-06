import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getCharacterByUserId } from '../database/characters.js';
import { addItemToInventory } from '../database/inventory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kit')
    .setDescription('Regala un kit de items utilizando un código.')
    .addStringOption(option =>
      option
        .setName('codigo')
        .setDescription('El código del kit a regalar.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const codigo = interaction.options.getString('codigo').trim().toUpperCase();

    // 🔹 Obtener datos del jugador
    const character = await getCharacterByUserId(userId);
    if (!character) {
      return interaction.reply({ content: "❌ No tienes un personaje creado. Usa `/crear_personaje` para comenzar tu aventura.", flags: MessageFlags.Ephemeral });
    }

    // Definir los kits disponibles (puedes extender esta lista según lo necesites)
    // Cada kit es un array de objetos que especifican el id del ítem y la categoría.
    const kitsDisponibles = {
      "FIRE-CUBE": [
        { id: 1, category: "Helms" },
        { id: 1, category: "Armors" },
        { id: 1, category: "Pants" },
        { id: 1, category: "Gloves" },
        { id: 1, category: "Boots" },
        { id: 1, category: "Weapons" },
      ],
      // "KIT_INICIAL": [
      //   { id: 201, category: "Helms" },
      //   { id: 202, category: "Armors" },
      //   { id: 203, category: "Pants" },
      //   { id: 204, category: "Gloves" },
      //   { id: 205, category: "Boots" }
      // ]
      // Puedes agregar más códigos e ítems aquí.
    };

    // Verificar que el código ingresado corresponda a un kit disponible
    const kit = kitsDisponibles[codigo];
    if (!kit) {
      return interaction.reply({
        content: "❌ El código ingresado no es válido.",
        flags: MessageFlags.Ephemeral
      });
    }

    try {
      // Por cada item definido en el kit, lo agregamos al inventario del usuario
      for (const item of kit) {
        await addItemToInventory(userId, item.id, item.category);
      }

      return interaction.reply({
        content: `🎉 ¡Has canjeado el kit ${codigo} exitosamente! Los items han sido agregados a tu inventario.`,
        flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      console.error("❌ Error al redimir el kit:", error);
      return interaction.reply({
        content: "❌ Ocurrió un error al redimir el kit. Inténtalo nuevamente más tarde.",
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
