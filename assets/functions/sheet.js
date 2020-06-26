const GSS = require(`google-spreadsheet`);
const logger = require("../../logger");
const chalk = require('chalk');

const creds = require(`../sheet_secret.json`);
const { resolve } = require("app-root-path");


module.exports = {
    getGameCount,
    newGame,
    updateGame,
    getGameRow,
    test
}

function newGame(state, op, guild) {
    return new Promise((resolve, reject) => {
        try {
            logger.log(`sheet`, `creating new game `);
            getSheet().then(sheet => {
                getNewId(sheet).then(id => {
                    resolve(id);
                    sheet.addRow({
                        id: id,
                        date: new Date().toUTCString(),
                        flushed: false,
                        lastPhase: `join`,
                        CPP: state.playerSize,
                        BPP: state.banSize,
                        rerolls: 0,
                        disabledDLCs: `-`,
                        guild: guild,
                        op: op,
                        playerCount: `-`
                    }).then(row => {
                        for (let i = 0; i < 64; i++) {
                            row._rawData.push(`-`)
                        }
                        row.save();
                    })
                })
            });
        } catch (error) {
            logger.log(`error`, `Error creating new game ${error}`);
            reject(error);
        }

    });

}
async function updateGame(state) {
    return new Promise((resolve, reject) => {
        try {
            logger.log(`sheet`, `updating game info...`);
            getGameRow(state.gameId).then(x => {
                x.flushed = state.flushed;
                x.lastPhase = state.Phase;
                x.rerolls = state.rerolls;
                x.CPP = state.playerSize;
                x.BPP = state.banSize;
                if (state.disabledDLC.length > 0)
                    x.disabledDLCs = state.disabledDLC.join(`\n`);
                else
                    x.disabledDLCs = `-`;
                x.playerCount = state.Players.length;
                for (let i = 0; i < state.Players.length; i++) {
                    const player = state.Players[i];
                    for (let j = 0; j < x._sheet.headerValues.length; j++) {
                        const element = x._sheet.headerValues[j];
                        if (element == `p${i + 1}`) {
                            x._rawData[j] = player.tag.split(`#`)[0];
                        }
                        else if (element == `p${i + 1}bans` && player.bans.length > 0) {
                            x._rawData[j] = player.bans.map(x => x.Name).join(`\n`);
                        }
                        else if (element == `p${i + 1}civs` && player.civs.length > 0) {
                            x._rawData[j] = player.civs.map(x => x.Name).join(`\n`);
                        }
                        else if (element == `p${i + 1}pick` && player.pick) {
                            0
                            x._rawData[j] = player.pick.Name;
                        }
                    }
                }
                x.save()
                logger.log(`sheet`, `updated game info`);
                resolve();

            })
        } catch (error) {
            logger.log(`error`, `failed updating game info ${error}`);
            reject()
        }
    });

}

function getGameRow(id) {
    return new Promise((resolve, reject) => {
        try {
            getRows().then(rows => {
                resolve(rows.find(row => row.id == id));
            });
        } catch (error) {
            logger.log(`error`, `Error getting game row ${error}`);
            reject(error);
        }

    });
}

function getGameCount(sheet) {
    return new Promise((resolve, reject) => {
        try {
            logger.log(`sheet`, `Fetching game count...`);
            getRows(sheet).then(rows => {
                resolve(+rows[rows.length - 1].id);
            });
            logger.log(`sheet`, `Fetched game count`);
        } catch (error) {
            logger.log(`error`, `Error getting game count ${error}`);
            reject(error);
        }

    });
}

function getNewId(sheet) {
    return new Promise((resolve, reject) => {
        try {

            getGameCount(sheet).then(count => {
                resolve(count + 1)
            })
        } catch (error) {
            logger.log(`error`, `Error while getting new id ${error}`);
            reject(error);
        }

    });
}


function getRows(sheet) {
    return new Promise((resolve, reject) => {
        try {
            if (!sheet)
                getSheet().then(sheet => {
                    sheet.getRows().then(rows => {
                        resolve(rows)
                    })
                })
            else {
                sheet.getRows().then(rows => {
                    resolve(rows)
                })
            }
        } catch (error) {
            logger.log(`error`, `Error while getting rows ${error}`);
            reject(error);
        }

    });
}
function getSheet() {
    return new Promise((resolve, reject) => {
        try {
            logger.log(`sheet`, `Fetching sheet...`)
            const doc = new GSS.GoogleSpreadsheet(`1db51c8lzs6TVJU7u2eL1_RkxFdMKfjfFYNHDdjgQbTg`);
            doc.useServiceAccountAuth(creds).then(() => {
                doc.getInfo().then(() => {
                    const sheet = doc.sheetsByIndex[0];
                    resolve(sheet);
                });
            });
        } catch (error) {
            logger.log(`error`, `Error while fetching sheet ${error}`);
            reject(error);
        }

    });
}
function test() {

}