import { Client, GatewayIntentBits } from 'discord.js';
import interactionHandler from './commands/interactionHandler.js';
import messagesHandler from './messages/messagesHandler.js';
import 'dotenv/config'
import { initializeDatabase } from './database/bd.js';

const TOKEN = process.env.TOKEN

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

await initializeDatabase()

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});


client.on('interactionCreate', async (interaction) => {
  await interactionHandler(interaction);
});

client.on('messageCreate', async (message) => {
  await messagesHandler(message);
});

client.login(TOKEN); // 🔹 Reemplaza con tu token

import http from "http"

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('El bot está funcionando.\n');
});

// Configurar el puerto
const PORT = process.env.PORT || 2400;
server.listen(PORT, () => {
  console.log(`Servidor web nativo corriendo en el puerto ${PORT}`);
});