
module.exports = {
    name: 'roll',
    description: 'Roll!',
    usage:
        `\`roll\` - random number in range 1-100  
\`roll <N>\` - random number in range 1-N
\`roll <M>-<N>\` - random number in range M-N
\`roll <M>d<N>\` - M random numbers in range 1-N `,
    execute: async function (message, args) {
        try {
            let n = 1;
            let min, max;
            if (!args[0]) {
                min = 1;
                max = 100;
            }
            else {
                if (args[0].includes('d')) {
                    let a = args[0].split('d');
                    n = parseInt(a[0]);
                    min = 1;
                    max = parseInt(a[1]);
                    if (n > 25)
                        n = 25;
                }
                else if (args[0].includes('-')) {
                    let a = args[0].split('-');
                    min = parseInt(a[0]);
                    max = parseInt(a[1]);
                    if (min > max)
                        [min, max] = [max, min];
                }
                else if (parseInt(args[0])) {
                    min = 1;
                    max = parseInt(args[0]);
                }
            }
            let text = `${n}x ${min}-${max}\n`
            for (let i = 0; i < n; i++) {
                text += ` ${getRandomInt(min, max)}\n`
            }
            message.reply(text).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`));
        } catch (error) {
            message.channel.send(`wrong arguments`)
                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed to roll ${error}`);

        }


    },
};
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}