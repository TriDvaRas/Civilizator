
const logger = require("../../logger");
const dbCreds = require(`../mongo_secret.json`);
const chalk = require(`chalk`)
const sheet = require(`./sheet`);
const { config } = require("winston");
const { resolve } = require("app-root-path");
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
    .then(() =>
        logger.log(`db`, `Connected to db`)
        ,
        err =>
            logger.log(`error`, `Failed connecting to db \n${err}`))



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
            },
                error => { reject(error) }
            );
        },
            error => { reject(error) }
        );
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
                    let newState = {
                        flushed: state.flushed,
                        lastPhase: state.Phase,
                        rerolls: state.rerolls,
                        CPP: state.playerSize,
                        BPP: state.banSize,
                        disabledDLCs: state.disabledDLC.length > 0 ? state.disabledDLC.join(`\n`) : `-`,
                        playerCount: state.Players.length
                    };

                    for (let i = 0; i < state.Players.length; i++) {
                        const player = state.Players[i];
                        newState[`p${i + 1}`] = {
                            name: player.tag.split(`#`)[0],
                            bans: player.bans.map(x => x.Name).join(`\n`),
                            civs: player.civs.map(x => x.Name).join(`\n`),
                            pick: player.pick == `-` ? `-` : player.pick.Name,
                        }
                    }
                    try {
                        for (const key in newState) {
                            if (newState.hasOwnProperty(key)) {
                                if (newState[key] === doc[key])
                                    delete newState[key];
                            }
                        }
                    } catch (error) {

                    }
                    coll.updateOne({ id: state.gameId }, { $set: newState }, function (err, res) {
                        if (err)
                            return reject(err);
                        resolve()
                        logger.log(`db`, `updated game info`);
                    })
                }
            )
        },
            error => { reject(error) }
        );
    });

}
function updateGameFinal(guild) {
    return new Promise((resolve, reject) => {
        getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, state) {
                if (err)
                    return reject(err);
                updateGame(state).then(() => {
                    logger.log(`db`, `updated game info FINAL`)

                    getCollection(`games`).then(coll => {
                        coll.findOne(
                            { id: state.gameId },
                            function (err, game) {
                                if (err)
                                    return reject(err);
                                sheet.SubmitGame(game)
                                    .then(() => {
                                        coll.updateOne({ id: state.gameId }, { $set: { sheetSync: true } }, function (err, res) {
                                            if (err)
                                                return logger.log(`error`, `${err}`);
                                            logger.log(`db`, `updated sheet game info FINAL`)
                                        })
                                    },
                                        err => logger.log(`warn`, `failed update sheet game info FINAL\n${err}`)
                                    );
                            }
                        )
                    },
                        error => { reject(error) }
                    );
                    resolve()
                },
                    err => reject(err)
                )
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
        },
            err => reject(err)
        );
    })
}
function getStats() {
    return new Promise((resolve, reject) => {
        getCollection(`stats`).then(coll => {
            coll.findOne({}, function (err, doc) {
                if (err) {
                    reject(err);
                    return logger.log(`error`, `${err}`);
                }

                resolve(doc)

            })
        },
            err => reject(err)
        );
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
            logger.log(`warn`, `db reconnecting?`)
            connectToDb().then(() => {
                getCollection(collection)
                    .then(coll => resolve(coll)
                        ,
                        err => reject(err)
                    )
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
                .on(`close`, err => {
                    logger.log(`db`, `${chalk.red(`db close`)}`);
                    logger.log(`warn`, err);
                    logger.log(`warn`, `${err}`);

                })
                .on(`timeout`, err => {
                    logger.log(`warn`, `${chalk.red(`db timedout`)}`);
                    logger.log(`warn`, err);
                    logger.log(`warn`, `${err}`);

                })
            resolve();
        });
    });
}
function addDoc(collection, doc) {
    return new Promise((resolve, reject) => {
        getCollection(collection).then(coll => {
            coll.insertOne(doc, function (err, res) {
                if (err)
                    reject(new Error(`Failed inserting doc into ${collection} \n${err}`));
                else
                    resolve(logger.log(`db`, `Inserted doc into ${collection}`));
            })
        },
            err => reject(err)
        );
    })
}
function removeDoc(collection, query) {
    return new Promise((resolve, reject) => {
        getCollection(collection).then(coll => {
            coll.deleteOne(query, function (err, res) {
                if (err)
                    reject(new Error(`Failed deleting doc from ${collection} \n${err}`));
                else
                    resolve(logger.log(`db`, `Deleted doc from ${collection}`));
            })
        },
            err => reject(err)
        );
    })
}
function addGameCount(guild) {
    getCollection(`guilds`).then(coll => {
        coll.findOne({ guildId: guild.id }, function (err, oldConfig) {
            if (err)
                return err;
            oldConfig.gameCount += 1;
            coll.updateOne({ guildId: guild.id }, { $set: oldConfig })
        })

    })
}
function addFastCount(guild) {
    getCollection(`guilds`).then(coll => {
        coll.findOne({ guildId: guild.id }, function (err, oldConfig) {
            if (err)
                return err;
            oldConfig.fastCount += 1;
            coll.updateOne({ guildId: guild.id }, { $set: oldConfig })
        })

    })
    getCollection(`stats`).then(coll => {
        coll.findOne({}, function (err, doc) {
            if (err) {
                reject(err);
                return logger.log(`error`, `${err}`);
            }
            coll.updateOne(
                {},
                { $set: { globalFastCount: doc.globalFastCount + 1 } },
                function (err) {
                    if (err) {
                        reject(err);
                        return logger.log(`error`, `${err}`);
                    }
                    else
                        resolve()
                }
            );


        })
    },
        err => reject(err)
    );
}
function setLastFast(guild) {
    getCollection(`guilds`).then(coll => {
        coll.findOne({ guildId: guild.id }, function (err, oldConfig) {
            if (err)
                return err;
            oldConfig.lastFast = Date.now();
            coll.updateOne({ guildId: guild.id }, { $set: oldConfig })
        })

    })
}
module.exports = {
    getGameId,
    newGame,
    updateGame,
    updateGameFinal,
    getCollection,
    addDoc,
    removeDoc,
    addGameCount,
    addFastCount,
    setLastFast,
    getStats,
}