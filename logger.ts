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

    transports: [
        new winston.transports.Console({
            level: `debug`,
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(msg => {
                    sendLog(msg)
                    const message = msg.message || msg.command || msg.button || `?`
                    return `${colorizer.colorize('verbose', `[${`${msg.timestamp}`.replace(/[T]/, ` `).replace(/[Z]/, ``)}]`)} ${colorizer.colorize([`cmd`, `btn`].includes(msg.level) ? `info` : msg.level, `[${msg.level.toUpperCase()}]`)
                        } ${typeof message === 'string' ? message : prettyFormat(message, {
                            indent: 8,
                            printBasicPrototype: false,
                            printFunctionName: true,
                        })}`
                })
            ),
        }),
        new winston.transports.File({
            level: `debug`,
            handleExceptions: true,
            filename: `./logs/debug.log`,
            maxsize: 5242880, // 5MB,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(msg => {
                    const message = msg.message || msg.command || msg.button || `?`
                    return `[${`${msg.timestamp}`.replace(/[T]/, ` `).replace(/[Z]/, ``)}] [${msg.level.toUpperCase()}] ${typeof message === 'string' ? message : prettyFormat(message, {
                        indent: 8,
                        printBasicPrototype: false,
                        printFunctionName: true,
                    })}`
                })
            ),
        }),
        new winston.transports.File({
            level: `btn`,
            handleExceptions: true,
            filename: `./logs/application.log`,
            maxsize: 5242880, // 5MB
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(msg => {
                    const message = msg.message || msg.command || msg.button || `?`
                    return `[${`${msg.timestamp}`.replace(/[T]/, ` `).replace(/[Z]/, ``)}] [${msg.level.toUpperCase()}] ${typeof message === 'string' ? message : prettyFormat(message, {
                        indent: 8,
                        printBasicPrototype: false,
                        printFunctionName: true,
                    })}`
                })
            ),
        }),
    ],
    exitOnError: false,
})