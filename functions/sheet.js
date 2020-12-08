const GSS = require(`google-spreadsheet`);
const logger = require("../logger");

const creds = require(`../assets/sheet_secret.json`);
const doc = new GSS.GoogleSpreadsheet(`1db51c8lzs6TVJU7u2eL1_RkxFdMKfjfFYNHDdjgQbTg`)
doc.useServiceAccountAuth(creds)

module.exports = {
    SubmitStats,
    SubmitGames
}


function getSheet(game) {
    return new Promise((resolve, reject) => {
        logger.log(`sheet`, `Fetching sheet...`)
        doc.getInfo().then(() => {
            let sheet;
            switch (game.toLowerCase()) {
                case `civ5`:
                    sheet = doc.sheetsByIndex[1]
                    break;
                case `lek`:
                    sheet = doc.sheetsByIndex[2]
                    break;
                case `civ6`:
                    sheet = doc.sheetsByIndex[3]
                    break;
                case `stats`:
                    sheet = doc.sheetsByIndex[4]
                    break;
                default:
                    sheet = doc.sheetsByIndex[0]
                    break;
            }
            resolve(sheet);
            logger.log(`sheet`, `Fetched sheet ${sheet.title}`)
        },
            err => reject(err)
        );

    });
}
function SubmitGames(games) {
    return new Promise((resolve, reject) => {
        if (games.length === 0)
            return resolve()
        games5 = games.filter(x => x.game == "Civ5")
        gameslek = games.filter(x => x.game == "LEK")
        games6 = games.filter(x => x.game == "Civ6")
        logger.log(`sheet`, `Submiting games`);

        let proms = [
            new Promise((res, rej) => {
                getSheet("Civ6").then(sheet => {
                    games6.forEach(newRow => {
                        delete newRow._id;
                        for (let i = 1; i <= 16; i++) {
                            if (newRow.hasOwnProperty(`p${i}`)) {
                                const player = newRow[`p${i}`];
                                newRow[`p${i}bans`] = player.bans;
                                newRow[`p${i}civs`] = player.civs;
                                newRow[`p${i}pick`] = player.pick;
                                newRow[`p${i}`] = player.name;
                            }
                        }
                        newRow.sheetSync = true;
                    })
                    sheet.addRows(games6).then(() => res(), rej)

                }, err => reject(err));
            }),
            new Promise((res, rej) => {
                getSheet("lek").then(sheet => {
                    gameslek.forEach(newRow => {
                        delete newRow._id;
                        for (let i = 1; i <= 16; i++) {
                            if (newRow.hasOwnProperty(`p${i}`)) {
                                const player = newRow[`p${i}`];
                                newRow[`p${i}bans`] = player.bans;
                                newRow[`p${i}civs`] = player.civs;
                                newRow[`p${i}pick`] = player.pick;
                                newRow[`p${i}`] = player.name;
                            }
                        }
                        newRow.sheetSync = true;
                    })
                    sheet.addRows(gameslek).then(() => res(), rej)
                })
            }),
            new Promise((res, rej) => {
                getSheet("Civ5").then(sheet => {
                    games5.forEach(newRow => {
                        delete newRow._id;
                        for (let i = 1; i <= 16; i++) {
                            if (newRow.hasOwnProperty(`p${i}`)) {
                                const player = newRow[`p${i}`];
                                newRow[`p${i}bans`] = player.bans;
                                newRow[`p${i}civs`] = player.civs;
                                newRow[`p${i}pick`] = player.pick;
                                newRow[`p${i}`] = player.name;
                            }
                        }
                        newRow.sheetSync = true;
                    })
                    sheet.addRows(games5).then(() => res(), rej)

                }, err => reject(err));
            })
        ]
        Promise.all(proms).then(resolve)
    });
}
function SubmitStats(newRow) {
    return new Promise((resolve, reject) => {
        logger.log(`sheet`, `Submitting stats`);
        getSheet(`stats`).then(sheet => {
            sheet.addRow(newRow)
                .then(() => resolve(),
                    err => reject(err)
                )
        },
            err => reject(err)
        );
    });
}