import * as winston from 'winston';

const colorizer = winston.format.colorize();
export const logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        dapi: 3,
        cmd: 4,
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
            return `${colorizer.colorize('verbose', `[${msg.timestamp}]`)} ${colorizer.colorize(msg.level, `[${msg.level.toUpperCase()}]`)} ${typeof msg.message === 'string' ? msg.message : JSON.stringify(msg.message)}`
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