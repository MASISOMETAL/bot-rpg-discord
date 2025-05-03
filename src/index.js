import { Client, GatewayIntentBits } from 'discord.js';
import interactionHandler from './commands/interactionHandler.js';
import messagesHandler from './messages/messagesHandler.js';
import 'dotenv/config'

const TOKEN = process.env.TOKEN

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

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
