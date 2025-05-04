// Link = https://discord.com/oauth2/authorize?client_id=1366544486477332563&permissions=8&scope=bot%20applications.commands

import { REST, Routes } from 'discord.js';
import 'dotenv/config'
import pingCommand from './commands/ping.js';
import crearPersonaje from './commands/crear_personaje.js';
import miPersonaje from './commands/mi_personaje.js';
import shop from './commands/shop.js';
import comprarItem from './commands/comprarItem.js';
import inventario from './commands/inventario.js';
import equiparItem from './commands/equiparItem.js';
import vender_item from './commands/vender_item.js';
import desequipar_item from './commands/desequipar_item.js';
import items from './commands/items.js';
import set_monster_channel from './commands/set_monster_channel.js';
import monster from './commands/monster.js';
import attack from './commands/attack.js';
import asignar_puntos from './commands/asignar_puntos.js';
import estadisticas from './commands/estadisticas.js';
import usar_item from './commands/usar_item.js';
import mi_skill from './commands/mi_skill.js';
import ayuda from './commands/ayuda.js';

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const commands = [
  pingCommand.data.toJSON(),
  crearPersonaje.data.toJSON(),
  miPersonaje.data.toJSON(),
  shop.data.toJSON(),
  comprarItem.data.toJSON(),
  inventario.data.toJSON(),
  equiparItem.data.toJSON(),
  vender_item.data.toJSON(),
  desequipar_item.data.toJSON(),
  items.data.toJSON(),
  set_monster_channel.data.toJSON(),
  monster.data.toJSON(),
  attack.data.toJSON(),
  asignar_puntos.data.toJSON(),
  estadisticas.data.toJSON(),
  usar_item.data.toJSON(),
  mi_skill.data.toJSON(),
  ayuda.data.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando comandos en Discord...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('✅ ¡Comandos registrados exitosamente!');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();
