
const appRoot = require('app-root-path');
const winston = require('winston');
const chalk = require(`chalk`)

// define the custom settings for each transport (file, console)
const options = {

    file: [
        {
            level: 'debug',
            filename: `${appRoot}/logs/raw.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
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
            format: winston.format.printf(log => `[${new Date(Date.now()).toLocaleString()}] [${log.level.toUpperCase()}] - ${log.message}`),
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
        info: 2,
        cmd: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7,
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
        case `DEBUG`:
            return chalk.bold.yellowBright(text);
        case `CMD`:
            return chalk.bold.rgb(255, 87, 20)(text);
        default:
            return chalk.green(text);
    }

}
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;