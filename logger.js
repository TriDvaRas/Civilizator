/*global process*/
const appRoot = require('app-root-path');
const winston = require('winston');
const chalk = require(`chalk`)

// define the custom settings for each transport (file, console)
const options = {

    file: [
        {
            level: 'self',
            filename: `${appRoot}/logs/self.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true,
            format: winston.format.combine(
                winston.format(log => log.level == 'self' ? log : false)(),
                winston.format.printf(log => `[${new Date(Date.now()).toLocaleString()}] [${log.level.toUpperCase()}] - ${log.message}`)
            )
        },
        {
            filename: `${appRoot}/logs/info.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            format: winston.format.printf(log => `[${new Date(Date.now()).toLocaleString()}] [${log.level.toUpperCase()}] - ${log.message}`),
        },
        {
            level: 'debug',
            filename: `${appRoot}/logs/debug.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            format: winston.format.printf(log => `[${new Date(Date.now()).toLocaleString()}] [${log.level.toUpperCase()}] - ${log.message}`),
        },
        {
            level: 'cmd',
            filename: `${appRoot}/logs/cmd.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            format: winston.format.printf(log => formatLog(log)),
        }
    ],
    console: [
        {
            level: `cmd`,
            handleExceptions: true,
            json: false,
            colorize: true,
            format: winston.format.printf(log => `[${chalk.cyan(new Date(Date.now()).toLocaleString())}] [${color(log.level.toUpperCase())}] - ${log.message}`)

        },
    ],
};

// instantiate a new Winston Logger with the settings defined above
let logger = new winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        dapi: 2,
        info: 3,
        cmd: 4,
        self: 5,
        db: 6,
        http: 8,
        verbose: 9,
        debug: 10,
        silly: 11,
    },
    transports: getTransports(),
    exitOnError: false, // do not exit on handled exceptions
});
function getTransports() {
    let transports = [];
    options.file.forEach(opt => {
        transports.push(new winston.transports.File(opt));
    });
    options.console.forEach(opt => {
        transports.push(new winston.transports.Console(opt));
    });
    return transports;
}
function color(text) {
    switch (text) {
        case `ERROR`:
            return chalk.bold.bgRedBright(text);
        case `WARN`:
            return chalk.bold.bgRgb(224, 134, 22)(text);
        case `DAPI`:
            return chalk.bold.bgRedBright(text);
        case `DEBUG`:
            return chalk.bold.yellowBright(text);
        case `CMD`:
            return chalk.bold.rgb(255, 87, 20)(text);
        case `SHEET`:
            return chalk.bold.greenBright(text);
        case `DB`:
            return chalk.bold.cyanBright(text);
        default:
            return chalk.green(text);
    }

}
function formatLog(log) {
    let msg = `[${new Date(Date.now()).toLocaleString()}] [${log.level.toUpperCase()}] - ${log.message}`
    if ([`error`, `warn`, `dapi`].includes(log.level) && globalThis.discordClient && !process.argv.includes(`test`)) {
        if (global.logGuild)
            if (log.level == `dapi`)
                global.logGuild.channels.cache.find(channel => channel.name == `api-errors`).send(msg);
            else
                global.logGuild.channels.cache.find(channel => channel.name == `error-log`).send(msg);
    }
    return msg;

}

module.exports = logger;