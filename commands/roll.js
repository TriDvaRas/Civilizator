/*global chalk logger*/
const rand = require(`../functions/randomizer`)
module.exports = {
    name: 'roll',
    description: 'Roll!',
    allowDM: true,
    usage:
        `\`roll\` - random number in range 1-100  
\`roll <N>\` - random number in range 1-N
\`roll <M>-<N>\` - random number in range M-N
\`roll <M>d<N>\` - M random numbers in range 1-N `,
    execute: function execute(message, args, guildConfig, isDM) {
        let n = 1
        let min = 1
        let max = 100
        if (args[0]) {
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
        if (isNaN(n) || isNaN(min) || isNaN(max)) {
            message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed to roll `);
        }
        else {
            let text = `${n}x ${min}-${max}\n`
            for (let i = 0; i < n; i++) {
                text += ` ${rand.randInt(min, max)}\n`
            }
            message.reply(text)
        }
    },
};