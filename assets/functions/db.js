
const logger = require("../../logger");
const dbCreds = require(`../mongo_secret.json`);
const chalk = require(`chalk`)

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(dbCreds.login,
    {
        //reconnectTries: 240,
        //reconnectInterval: 500,
        useUnifiedTopology: true
    });

let dbClient;
logger.log(`db`, `connecting to db`);
connectToDb()
    .then(() => logger.log(`db`, `Connected to db`))
    .catch(err => logger.log(`error`, `Failed connecting to db \n${err}`))



//+
function newGame(state, op, guild) {
    return new Promise((resolve, reject) => {
        logger.log(`db`, `creating new game`);

        getCollection(`games`).then(coll => {
            getGameId(true).then(id => {
                resolve(id);
                let newDoc = {
                    id: id,
                    date: new Date(),
                    flushed: false,
                    sheetSync: false,
                    lastPhase: `join`,
                    CPP: state.playerSize,
                    BPP: state.banSize,
                    rerolls: 0,
                    disabledDLCs: `-`,
                    guild: guild,
                    op: op,
                    playerCount: 0
                }
                coll.insertOne(newDoc, function (err, result) {
                    if (err) {
                        reject(err);
                        return logger.log(`error`, `${err}`);
                    }
                    logger.log(`db`, `created new game ${id}`);
                });
            }).catch(error => { reject(error) });
        }).catch(error => { reject(error) });
    });

}

//+
function updateGame(state) {
    return new Promise((resolve, reject) => {
        logger.log(`db`, `updating game info...`);
        getCollection(`games`).then(coll => {
            coll.findOne(
                { id: state.gameId },
                function (err, doc) {
                    let x = {};
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
                        x[`p${i + 1}`] = {
                            name: player.tag.split(`#`)[0],
                            bans: player.bans.map(x => x.Name).join(`\n`),
                            civs: player.civs.map(x => x.Name).join(`\n`),
                            pick: player.pick == `-` ? `-` : player.pick.Name,
                        }
                    }
                    for (const key in x) {
                        if (x.hasOwnProperty(key)) {
                            if (x[key] === doc[key])
                                delete x[key];
                        }
                    }
                    coll.updateOne({ id: state.gameId }, { $set: x })
                    resolve()
                    logger.log(`db`, `updated game info`);
                }
            )
        }).catch(error => { reject(error) })
    });

}
function updateGameFinal(guild) {
    return new Promise((resolve, reject) => {
        getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, state) {
                if (err)
                    return reject(err);
                updateGame(state).then(() => resolve(logger.log(`db`, `updated game info FINAL`))).catch(err => reject(err))
            })

        })
    });

}

//+
function getGameId(increment) {
    return new Promise((resolve, reject) => {
        getCollection(`stats`).then(coll => {
            coll.findOne({}, function (err, doc) {
                if (err) {
                    reject(err);
                    return logger.log(`error`, `${err}`);
                }

                if (increment) {
                    resolve(doc.lastGameId + 1)
                    coll.updateOne(
                        {},
                        { $set: { lastGameId: doc.lastGameId + 1 } },
                        function (err) {
                            if (err) {
                                reject(err);
                                return logger.log(`error`, `${err}`);
                            }
                        })
                }
                else {
                    resolve(doc.lastGameId);
                }

            })
        }).catch(err => reject(err));
    })
}

//+
function getCollection(collection) {
    return new Promise((resolve, reject) => {


        logger.log(`db`, `Getting collection ${collection}`)
        if (dbClient) {
            switch (collection) {
                case `games`:
                    logger.log(`db`, `Collection got`);
                    resolve(dbClient.db(dbCreds.dbName).collection(`Games`));
                    break;
                case `states`:
                    logger.log(`db`, `Collection got`);
                    resolve(dbClient.db(dbCreds.dbName).collection(`States`));
                    break;
                case `stats`:
                    logger.log(`db`, `Collection got`);
                    resolve(dbClient.db(dbCreds.dbName).collection(`Stats`));
                    break;
                case `guilds`:
                    logger.log(`db`, `Collection got`);
                    resolve(dbClient.db(dbCreds.dbName).collection(`Guilds`));
                    break;
                default:
                    reject(new Error(`Invalid collection`))
                    break;
            }


        } else {
            connectToDb().then(() => {
                getCollection(collection)
                    .then(coll => resolve(coll))
                    .catch(err => reject(err))
            });
        }

    });
}



function connectToDb() {
    return new Promise((resolve, reject) => {
        logger.log(`db`, `ConnectCalled`);
        mongoClient.connect(function (err, client) {
            if (err) {
                reject();
                return logger.log(`error`, `${err}`);
            }
            dbClient = client;
            client
            .on(`close`,()=>{
                logger.log(`db`, `${chalk.red(close)}`);
                
            })
            .on(`timeout`,()=>{
                logger.log(`db`, `${chalk.red(close)}`);
                
            })
            resolve();
        });
    });
}


module.exports = {
    getGameId,
    newGame,
    updateGame,
    updateGameFinal,
    getCollection,
}