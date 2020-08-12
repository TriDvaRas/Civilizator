const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const chalk = require('chalk');

const creds = require(`../assets/sheet_secret.json`);


module.exports = {
    SubmitGame,
}

function SubmitGame(newRow) {
    return new Promise((resolve, reject) => {
        logger.log(`sheet`, `Submitting final game state`);
        getSheet(newRow.game).then(sheet => {
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
            if (newRow.sheetSync === true) {
                sheet.getRows()
                    .then(rows => {
                        let row = rows.find(row => row.id == newRow.id);

                        for (const key in newRow) {
                            if (newRow.hasOwnProperty(key)) {
                                if (row[key] && newRow[key] != row[key])
                                    row[key] = newRow[key];
                            }
                        }
                        row.save()
                        resolve()
                    },
                        err => reject(err)
                    );
            }
            else {
                newRow.sheetSync = true;
                sheet.addRow(newRow)
                    .then(() => resolve(),
                        err => reject(err)
                    );

            }
        },
            err => reject(err)
        );
    });
}

function getSheet(game) {
    return new Promise((resolve, reject) => {
        logger.log(`sheet`, `Fetching sheet...`)
        const doc = new GSS.GoogleSpreadsheet(`1db51c8lzs6TVJU7u2eL1_RkxFdMKfjfFYNHDdjgQbTg`);
        doc.useServiceAccountAuth(creds).then(() => {
            doc.getInfo().then(() => {
                let sheet;
                switch (game.toLowerCase()) {
                    case `civ5`:
                        sheet = doc.sheetsByIndex[1]
                        break;
                    case `lek`:
                        sheet = doc.sheetsByIndex[2]
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
        },
            err => reject(err)
        );

    });
}