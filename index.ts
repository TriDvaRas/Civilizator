import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' })
import * as winston from 'winston';
import { onGuildJoin, onGuildKick, onGuildUpdate } from './handlers/guildHandler';
import interactionHandler from './handlers/interactionHandler';
import messageHandler from './handlers/messageHandler';
import { logger } from './logger';
declare global {
    let client: Client;
    let log: winston.Logger;
}
//@ts-ignore
global.log = logger
//@ts-ignore
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

log.info(`Starting CivBOT v${process.env.npm_package_version}`);
client.once('ready', () => {
    log.info(`Logged in as ${client.user?.tag}`);
});
client.on('messageCreate', messageHandler);
client.on('interactionCreate', interactionHandler);
client.on('guildCreate', onGuildJoin)
client.on('guildDelete', onGuildKick)
client.on('guildUpdate', onGuildUpdate)
client.login(process.env.TOKEN);