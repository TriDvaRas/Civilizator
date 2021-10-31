import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' })
import * as winston from 'winston';
import api from './api/api';
import { onGuildJoin, onGuildKick, onGuildUpdate } from './handlers/guildHandler';
import interactionHandler from './handlers/interactionHandler';
import messageHandler from './handlers/messageHandler';
import { logger } from './logger';
import { initCrons } from './managers/cronManager';
import * as pjson from './package.json'
declare global {
    let client: Client;
    let log: winston.Logger;
}
//@ts-ignore
global.log = logger
//@ts-ignore
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] , partials: ['CHANNEL']});
log.info(`Starting CivBOT v${pjson.version}`);
client.once('ready', async () => {
    initCrons()
    log.warn(`Logged in as ${client.user?.tag} \n\t\tCivBOT v${pjson.version || `FUCK`}\t\tCivAPI v${await api.version() || `FUCK`}`);
});
client.on('messageCreate', messageHandler);
client.on('interactionCreate', interactionHandler);
client.on('guildCreate', onGuildJoin)
client.on('guildDelete', onGuildKick)
client.on('guildUpdate', onGuildUpdate)
client.login(process.env.TOKEN);