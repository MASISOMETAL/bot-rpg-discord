import pingCommand from './ping.js';
import crearPersonaje from './crear_personaje.js';
import mi_personaje from './mi_personaje.js';
import shop from './shop.js';
import comprarItem from './comprarItem.js';
import inventario from './inventario.js';
import equiparItem from './equiparItem.js';
import vender_item from './vender_item.js';
import desequipar_item from './desequipar_item.js';
import items from './items.js';
import set_monster_channel from './set_monster_channel.js';
import monster from './monster.js';
import attack from './attack.js';
import asignar_puntos from './asignar_puntos.js';
import estadisticas from './estadisticas.js';
import usar_item from './usar_item.js';
import mi_skill from './mi_skill.js';
import ayuda from './ayuda.js';
import elementos from './elementos.js';
import rank from './rank.js';
import personaje_de from './personaje_de.js';
import kits from './kits.js';

const commands = {
  ping: pingCommand,
  crear_personaje: crearPersonaje,
  mi_personaje: mi_personaje,
  tienda: shop,
  comprar_item: comprarItem,
  inventario: inventario,
  equipar_item: equiparItem,
  vender_item: vender_item,
  desequipar_item: desequipar_item,
  items: items,
  set_monster_channel: set_monster_channel,
  monster,
  ataque: attack,
  asignar_puntos,
  estadisticas,
  usar_item,
  mis_habilidades: mi_skill,
  ayuda,
  elementos,
  rank,
  personaje_de,
  kit: kits,
};

export default async function interactionHandler(interaction) {
  if (!interaction.isCommand()) return;

  const command = commands[interaction.commandName];
  if (command) {
    await command.execute(interaction);
  }
}
