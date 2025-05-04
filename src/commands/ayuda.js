import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Muestra información sobre los comandos disponibles.')
    .addStringOption(option =>
      option.setName('categoria')
        .setDescription('Elige una categoría de ayuda')
        .setRequired(true)
        .addChoices(
          { name: "Personaje", value: "personaje" },
          { name: "Inventario y tienda", value: "inventario" },
          { name: "Combate", value: "combate" },
          { name: "Información", value: "informacion" }
        )),

  async execute(interaction) {
    const category = interaction.options.getString('categoria');

    const categories = {
      "personaje": {
        title: "⚔️ Comandos de Personaje",
        description: "Interacciones relacionadas con tu personaje.",
        fields: [
          { name: "`/crear_personaje`", value: "Crea un personaje en el juego." },
          { name: "`/mi_personaje`", value: "Muestra las estadísticas y equipamiento de tu personaje." },
          { name: "`/estadisticas`", value: "Muestra estadísticas generales de progreso." },
          { name: "`/asignar_puntos [stat] [cantidad]`", value: "Asigna puntos de mejora cuando subes de nivel." }
        ]
      },
      "inventario": {
        title: "🛒 Inventario y Tienda",
        description: "Comandos relacionados con la compra y administración de ítems.",
        fields: [
          { name: "`/shop [categoria]`", value: "Explora la tienda por categoría." },
          { name: "`/comprar_item [categoria] [id]`", value: "Compra un ítem específico en la tienda." },
          { name: "`/equipar_item [id]`", value: "Equipa un ítem de tu inventario." },
          { name: "`/desequipar_item [slot]`", value: "Desequipa un ítem de un slot específico." },
          { name: "`/inventario`", value: "Muestra todos los ítems que posees." },
          { name: "`/usar_item [id]`", value: "Usa un ítem consumible." },
          { name: "`/vender_item [id]`", value: "Vende un ítem de tu inventario." }
        ]
      },
      "combate": {
        title: "⚔️ Comandos de Combate",
        description: "Interacciones con monstruos y habilidades.",
        fields: [
          { name: "`/attack [monster id] [skill id]`", value: "Ataca a un monstruo. Actualmente el `skill id` es siempre `1`." },
          { name: "`/mi_skill`", value: "Muestra todas las habilidades que has aprendido." },
          { name: "`/mi_skill [id]`", value: "Muestra detalles de una habilidad específica." },
          { name: "`/monster`", value: "Muestra todos los monstruos activos en el servidor." },
          { name: "`/monster [id]`", value: "Muestra detalles de un monstruo específico." }
        ]
      },
      "informacion": {
        title: "📜 Información",
        description: "Accede a datos generales del juego.",
        fields: [
          { name: "`/items [categoria]`", value: "Muestra todos los ítems disponibles en una categoría." },
          { name: "`/items [categoria] [id]`", value: "Muestra información detallada sobre un ítem específico." },
          { name: "`/ayuda`", value: "Muestra información sobre los comandos disponibles." }
        ]
      }
    };

    const selectedCategory = categories[category];

    if (!selectedCategory) {
      return interaction.reply({ content: "❌ Categoría no válida.", flags: MessageFlags.Ephemeral });
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(selectedCategory.title)
      .setDescription(selectedCategory.description)
      .addFields(...selectedCategory.fields);

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};
