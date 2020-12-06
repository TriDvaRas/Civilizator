const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const chalk = require('chalk');

const creds = require(`../assets/sheet_secret.json`);
const doc = new GSS.GoogleSpreadsheet(`1db51c8lzs6TVJU7u2eL1_RkxFdMKfjfFYNHDdjgQbTg`)
doc.useServiceAccountAuth(creds)

module.exports = {
    SubmitStats
}


function getSheet(game) {
    return new Promise((resolve, reject) => {
        logger.log(`sheet`, `Fetching sheet...`)
        doc.getInfo().then(() => {
            let sheet;
            switch (game.toLowerCase()) {
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