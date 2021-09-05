import * as winston from 'winston';
import { sendLog } from './util/discordLogger';
import { format as prettyFormat } from 'pretty-format';

const colorizer = winston.format.colorize();
export const logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        dapi: 3,
        cmd: 4,
        btn: 4,
        self: 5,
        db: 6,
        http: 8,
        verbose: 9,
        debug: 10,
        silly: 11,
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(msg => {
            sendLog(msg)
            return `${colorizer.colorize('verbose', `[${msg.timestamp}]`)} ${colorizer.colorize([`cmd`, `btn`].includes(msg.level) ? `info` : msg.level, `[${msg.level.toUpperCase()}]`)} ${typeof msg.message === 'string' ? msg.message : prettyFormat(msg.message, {
                indent: 8,
                printBasicPrototype: false,
                printFunctionName: true,
            })}`
        })
    ),
    transports: [
        new winston.transports.Console({
            level: `debug`,
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
})