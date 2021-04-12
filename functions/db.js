/* global logger, gameNames,activeGames */
const mysql = require('mysql2');
const connection = mysql.createConnection(require(`../assets/mysql_secret.json`));
const { Collection } = require(`discord.js`)

let civLists = new Collection()
updateCivLists()
let statesCache = new Collection()

class State {
    constructor(rawState, rawPlayers) {
        //uncountable
        this.gameId = rawState.id
        this.gameName = rawState.game_name
        this.guildId = rawState.guild_id
        this.embedId = rawState.embed_id
        this.opId = rawState.op_id
        this.startedAt = rawState.started_at

        this.pickMsgs = rawState.pick_msgs
        this.phase = rawState.last_phase
        this.cpp = rawState.cpp
        this.bpp = rawState.bpp
        this.rerolls = rawState.rerolls
        this.dlcs = rawState.dlcs
        this.disabledDLCs = rawState.disabledDLCs
        this.civs = rawState.civs
        this.disabledCivs = rawState.disabled
        this.banned = rawState.banned
        this.picked = rawState.picked
        this.players = rawPlayers.map(x => {
            return {
                id: x.player_id,
                slot: x.player_slot,
                reVote: x.re_vote == 1 ? true : false,
                bans: x.bans,
                civs: x.civs,
                pick: x.pick
            }
        })


        //countable
        this.bansFull = this.players.length * this.bpp
        this.reVotesFull = Math.ceil(this.players.length * .65)
        this.civList = civLists.get(this.gameName)
        this.fetchedAt = Date.now()

        if (this.embedId) {
            this.embedMsg = activeGames.get(this.gameId)?.message
            this.embed = activeGames.get(this.gameId)?.message.embeds[0]
        }

        statesCache.set(this.gameId, this)
    }

    getFreeSlot() {
        let s = 1;
        while (this.players.find(x => x.slot == s))
            s++
        return s
    }

    setFlushed() {
        this.flushed = true
        return new Promise((resolve, reject) => {
            let q = `UPDATE games SET flushed=TRUE WHERE id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  SET flushed id=${this.gameId}\n${err}`)
                    this.flushed = false
                    reject(new Error(`Failed  SET flushed id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  SET flushed id=${this.gameId}`)
                    statesCache.delete(this.gameId)
                    activeGames.delete(this.gameId)
                    resolve()
                }
            })
        })
    }

    addPlayer(user) {
        let p = {
            id: user.id,
            slot: this.getFreeSlot(this.players),
            reVote: false,
            bans: [],
            civs: []
        }
        this.players.push(p)
        this.bansFull = this.players.length * this.bpp
        this.reVotesFull = Math.ceil(this.players.length * .65)
        return new Promise((resolve, reject) => {
            checkIfNewPlayer(user)
                .then(() => {
                    let q = `INSERT player_states(
                        game_id,
                        player_id,
                        player_slot,
                        re_vote,
                        bans,
                        civs
                    ) VALUES (
                        '${this.gameId}',
                        '${p.id}',
                        '${p.slot}',
                        FALSE,
                        '[]',
                        '[]'
                    )`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  INSERT player_state\n${err}`)
                            reject(err)
                        }
                        else {
                            logger.log('db', `succ  INSERT player_state`)
                            resolve()
                        }
                    })
                })
        })
    }

    remPlayer(user) {
        this.players = this.players.filter(x => x.id != user.id)
        this.bansFull = this.players.length * this.bpp
        this.reVotesFull = Math.ceil(this.players.length * .65)
        return new Promise((resolve, reject) => {
            checkIfNewPlayer(user)
                .then(() => {
                    let q = `DELETE FROM player_states 
                    WHERE game_id=${this.gameId} AND player_id='${user.id}'`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  DELETE player_state\n${err}`)
                            reject(new Error(`Failed  DELETE player_state\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  DELETE player_state`)
                            resolve()
                        }
                    })
                })
        })
    }

    resetDLC() {
        return this.updateDLC([this.dlcs, this.disabledDLCs].flat(), [])
    }

    updateDLC(enabled, disabled) {
        this.dlcs = enabled
        this.disabledDLCs = disabled
        //recalc disabledCivs
        this.civs = civLists.get(this.gameName)
            .filter(x => enabled.includes(x.dlc) && !(this.dlcs.includes(`PersonaPack`) && x.id == x.persona))
            .map(x => x.id)
        this.disabledCivs = civLists.get(this.gameName)
            .filter(x => disabled.includes(x.dlc) || (this.dlcs.includes(`PersonaPack`) && x.id == x.persona))
            .map(x => x.id)
        return new Promise((resolve, reject) => {
            let q = `UPDATE game_states SET 
            civs='${JSON.stringify(this.civs)}',
            disabled='${JSON.stringify(this.disabledCivs)}',
            dlcs='${JSON.stringify(this.dlcs)}',
            disabledDLCs='${JSON.stringify(this.disabledDLCs)}'
            WHERE game_id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  updateDLC id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  updateDLC id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  updateDLC id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    updateSettings(settings) {
        if (settings.cpp)
            this.cpp = settings.cpp
        if (settings.bpp) {
            this.bpp = settings.bpp
            this.bansFull = this.players.length * this.bpp
        }
        return new Promise((resolve, reject) => {
            if (!settings.cpp && !settings.bpp)
                resolve()
            let qs = []
            if (settings.cpp)
                qs.push(`cpp=${settings.cpp}`)
            if (settings.bpp)
                qs.push(`bpp=${settings.bpp}`)
            let q = `UPDATE games SET ${qs.join(`,`)} WHERE id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  updateSettings id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  updateSettings id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  updateSettings id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    updatePhase(phase) {
        this.phase = phase
        return new Promise((resolve, reject) => {
            let q = `UPDATE games SET last_phase='${phase}' WHERE id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  updatePhase id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  updatePhase id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  updatePhase id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    addBan(user, civId) {
        if (civId > 0) {
            this.civs = this.civs.filter(x => x != civId)
            this.banned.push(+civId)
        }
        let player = this.players.find(x => x.id == user.id)
        player.bans.push(+civId)
        return new Promise((resolve, reject) => {
            Promise.all([
                new Promise((reso, reje) => {
                    let q = `UPDATE game_states SET 
                    civs='${JSON.stringify(this.civs)}',
                    banned='${JSON.stringify(this.banned)}'
                    WHERE game_id=${this.gameId}`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  addBan1 id=${this.gameId}\n${err}`)
                            reje(new Error(`Failed  addBan1 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  addBan1 id=${this.gameId}`)
                            reso()
                        }
                    })
                }),
                new Promise((reso, reje) => {
                    let q = `UPDATE player_states SET 
                    bans='${JSON.stringify(player.bans)}'
                    WHERE game_id=${this.gameId} AND player_id='${user.id}'`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  addBan2 id=${this.gameId}\n`)
                            reje(new Error(`Failed  addBan2 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  addBan2 id=${this.gameId}`)
                            reso()
                        }
                    })
                })
            ]).then(() => {
                resolve()
            })

        })
    }

    addReVote(user) {
        let player = this.players.find(x => x.id == user.id)
        player.reVote = true
        return new Promise((resolve, reject) => {
            let q = `UPDATE player_states SET 
                    re_vote=TRUE
                    WHERE game_id=${this.gameId} AND player_id='${user.id}'`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  addReVote id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  addReVote id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  addReVote id=${this.gameId}`)
                    resolve()
                }
            })

        })
    }

    remReVote(user) {
        let player = this.players.find(x => x.id == user.id)
        player.reVote = false
        return new Promise((resolve, reject) => {
            let q = `UPDATE player_states SET 
                    re_vote=FALSE
                    WHERE game_id=${this.gameId} AND player_id='${user.id}'`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  remReVote id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  remReVote id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  remReVote id=${this.gameId}`)
                    resolve()
                }
            })

        })
    }

    resetAllPlayerReVotes() {
        for (const player of this.players)
            player.reVote = false;

        return new Promise((resolve, reject) => {
            let q = `UPDATE player_states SET 
                    re_vote=FALSE
                    WHERE game_id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  resetReVotes id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  resetReVotes id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  resetReVotes id=${this.gameId}`)
                    resolve()
                }
            })

        })
    }

    addReroll() {
        this.rerolls++
        return new Promise((resolve, reject) => {
            let q = `UPDATE games SET rerolls=${this.rerolls} WHERE id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  addReroll id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  addReroll id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  addReroll id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    addPickedCiv(civId, player) {
        this.civs = this.civs.filter(x => x != civId)
        this.picked.push(+civId)
        player.civs.push(+civId)
        return new Promise((resolve, reject) => {
            Promise.all([
                new Promise((reso, reje) => {
                    let q = `UPDATE game_states SET 
                    civs='${JSON.stringify(this.civs)}',
                    picked='${JSON.stringify(this.picked)}'
                    WHERE game_id=${this.gameId}`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  addPickedCiv1 id=${this.gameId}\n${err}`)
                            reje(new Error(`Failed  addPickedCiv1 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  addPickedCiv1 id=${this.gameId}`)
                            reso()
                        }
                    })
                }),
                new Promise((reso, reje) => {
                    let q = `UPDATE player_states SET 
                    civs='${JSON.stringify(player.civs)}'
                    WHERE game_id=${this.gameId} AND player_id='${player.id}'`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  addPickedCiv2 id=${this.gameId}\n${err}`)
                            reje(new Error(`Failed  addPickedCiv2 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  addPickedCiv2 id=${this.gameId}`)
                            reso()
                        }
                    })
                })
            ]).then(() => {
                resolve()
            })

        })
    }

    resetPickedCivs() {
        this.civs = [...this.civs, ...this.picked]
        this.picked = []
        for (const player of this.players) {
            player.civs = []
            player.pick = null
        }
        return new Promise((resolve, reject) => {
            Promise.all([
                new Promise((reso, reje) => {
                    let q = `UPDATE game_states SET 
                    civs='${JSON.stringify(this.civs)}',
                    picked='[]'
                    WHERE game_id=${this.gameId}`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  resetPickedCivs1 id=${this.gameId}\n${err}`)
                            reje(new Error(`Failed  resetPickedCivs1 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  resetPickedCivs1 id=${this.gameId}`)
                            reso()
                        }
                    })
                }),
                new Promise((reso, reje) => {
                    let q = `UPDATE player_states SET 
                    civs='[]',
                    pick=NULL
                    WHERE game_id=${this.gameId}`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  resetPickedCivs2 id=${this.gameId}\n${err}`)
                            reje(new Error(`Failed  resetPickedCivs2 id=${this.gameId}\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  resetPickedCivs2 id=${this.gameId}`)
                            reso()
                        }
                    })
                })
            ]).then(() => {
                resolve()
            })
        })
    }

    setPlayerPick(civId, player) {
        player.pick = civId
        return new Promise((resolve, reject) => {
            let q = `UPDATE player_states SET 
            pick=${civId}
            WHERE game_id=${this.gameId} AND player_id='${player.id}'`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  setPlayerPick id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  setPlayerPick id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  setPlayerPick id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    addPickMsg(msg) {
        this.pickMsgs.push(msg.id)
        return new Promise((resolve, reject) => {
            let q = `UPDATE game_states SET 
                pick_msgs='${JSON.stringify(this.pickMsgs)}' 
            WHERE game_id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  addPickMsg id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  addPickMsg id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  addPickMsg id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }

    setEmbed(msg, emb) {
        this.embedMsg = msg
        this.embedId = msg.id
        this.embed = emb
        return new Promise((resolve, reject) => {
            let q = `UPDATE game_states SET embed_id='${this.embedId}' WHERE game_id=${this.gameId}`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  SET embed_id id=${this.gameId}\n${err}`)
                    reject(new Error(`Failed  SET embed_id id=${this.gameId}\n${err}`))
                }
                else {
                    logger.log('db', `succ  SET embed_id id=${this.gameId}`)
                    resolve()
                }
            })
        })
    }


}

function updateCivLists() {
    return new Promise((resolve, reject) => {
        let ps = []
        for (const game of gameNames) {
            ps.push(
                getCivList(game).then(list => {
                    list.forEach(civ => {
                        delete civ.game
                        civ.path = civ.thumbnail_path
                        delete civ.thumbnail_path
                        civ.persona = civ.persona_id
                        delete civ.persona_id
                    });
                    civLists.set(game, list)
                })
            )
        }
        Promise.all(ps).then(() => {
            resolve()
            logger.log('db', `succ  getCivList `)
        })

    })

}

function getCivList(gameName) {
    return new Promise((resolve, reject) => {
        let q = `SELECT * FROM civilizations WHERE game='${gameName}'`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getCivList \n${err}`)
                reject(new Error(`Failed  getCivList \n${err}`))
            }
            else {
                logger.log('db', `succ  getCivList `)
                resolve(res)
            }
        })
    })
}

function newGame(guild, author, gameMessage, options) {
    //flush prev game
    statesCache.each(x => {
        if (x.guildId == guild.id)
            x.setFlushed()
    })
    return new Promise((resolve, reject) => {
        getGamesCount().then(lastGameId => {
            let id = lastGameId + 1
            activeGames.set(id, {
                guild: guild,
                message: gameMessage,
                phase: `join`,
                startedAt: Date.now(),
                lastActiveAt: Date.now(),
                collectors: []
            })

            checkIfNewPlayer(author)
                .then(() => createGame(id, guild, author, options), reject)
                .then(() => createGameState(id, gameMessage, options), reject)
                .then(() => getState(id), reject)
                .then(resolve, reject)
        })
        updateGuildConfig(guild.id, null, { name: guild.name, avatar: guild.icon })
    });
}

function checkIfNewPlayer(author) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT tag FROM players WHERE id='${author.id}'`, (err, res) => {
            if (err) {
                logger.log('error', `Failed  SELECT player\n${err}`)
                reject(new Error(`Failed  SELECT player\n${err}`))
            }
            else {
                if (res.length == 0) {
                    let q = `INSERT players(id, tag, joined_at) 
                    VALUES(
                        '${author.id}',
                         '${author.tag.replace(/'/gmu, `\\'`)}',
                          '${new Date().toISOString().slice(0, 19).replace('T', ' ')}'
                          )`
                    connection.query(q, (err, res) => {
                        if (err) {
                            logger.log('error', `Failed  INSERT player\n${err}`)
                            reject(new Error(`Failed  INSERT player\n${err}`))
                        }
                        else {
                            logger.log('db', `succ  INSERT player`)
                            resolve()
                        }
                    })
                }
                else {
                    resolve()
                    if (author.tag && res) {
                        let q = `UPDATE players SET tag='${author.tag.replace(/'/gmu, `\\'`)}',avatar=${author.avatar ? `'${author.avatar.replace(/'/gmu, `\\'`)}'` : `NULL`} WHERE id='${author.id}'`
                        connection.query(q, (err, res) => {
                            if (err) {
                                logger.log('error', `Failed  UPDATE player\n${err}`)
                            }
                            else {
                                logger.log('db', `succ  UPDATE player`)
                            }
                        })
                    }
                }
            }
        })
    })
}

function createGame(id, guild, author, options) {
    return new Promise((resolve, reject) => {
        let q = `INSERT games (
            id,
            guild_id,
            ${options.cpp ? `cpp,` : ``}
            ${options.bpp ? `bpp,` : ``}
            game_name,
            last_phase,
            started_at,
            op_id
        ) VALUES (
            ${id},
            '${guild.id}',
            ${options.cpp ? `${options.cpp},` : ``}
            ${options.bpp ? `${options.bpp},` : ``}
            '${options.game ? `${options.game}` : `Civ5`}',
            'init',
            '${new Date().toISOString().slice(0, 19).replace('T', ' ')}',
            '${author.id}'
            )
            `
        //TODO date ^^
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  INSERT new game\n${err}\n${q}`)
                reject(new Error(`Failed  INSERT new game\n${err}\n${q}`))
            }
            else {
                logger.log('db', `Succ  INSERT new game`)
                resolve()
            }

        })
    })
}

function createGameState(id, gameMessage, options) {
    return new Promise((resolve, reject) => {
        getDefaultStateInfo(options.game ? `${options.game}` : `Civ5`).then(defaults => {
            let q = `INSERT game_states(
                game_id,
                embed_id,
                pick_msgs,
                civs,
                banned,
                picked,
                dlcs,
                disabled,
                disabledDLCs
            ) VALUES (
                ${id},
                '${gameMessage.id}',
                '[]',
                '[${defaults.ids.join(`,`)}]',
                '[]',
                '[]',
                '[${defaults.dlcs.map(x => `"${x}"`).join(`,`)}]',
                '[]',
                '[]'
            );`
            connection.query(q, (err, res) => {
                if (err) {
                    logger.log('error', `Failed  INSERT game_state\n${q}\n${err}`)
                    reject(new Error(`Failed  INSERT game_state\n${q}\n${err}`))
                }
                else {
                    logger.log('db', `Succ  INSERT game_state`)
                    resolve()
                }
            })
        })// TODO disable personas by default

    })
}

function getDefaultStateInfo(game) {
    return new Promise((resolve, reject) => {
        let q = `SELECT id, dlc FROM civilizations WHERE game='${game}'`
        connection.query(q, (err, res) => {
            if (err)
                reject(err)
            else {
                resolve({
                    ids: res.map(x => x.id),
                    dlcs: res.map(x => x.dlc).filter((value, index, self) => self.indexOf(value) === index)
                });
            }
        })

    })
}

function getGamesCount() {
    return new Promise((resolve, reject) => {
        let q = `SELECT MAX(id) FROM games`
        connection.query(q, (err, res) => {
            if (err)
                reject(err)
            else
                resolve(res[0][`MAX(id)`])
        })
    })
}

//--------------------

function getState(gameId) {
    return new Promise((resolve, reject) => {
        if (gameId) {
            let s = statesCache.get(gameId)
            if (s && Date.now() - s.fetchedAt < 600000)
                resolve(s)
            else
                Promise.all([fetchGameState(gameId), fetchPlayerStates(gameId)])
                    .then(res => {
                        const [game, players] = res
                        resolve(new State(game, players))
                    })
                    .catch(err => {
                        reject(err)
                    })
        }
        else
            reject(new Error(`Can't getState without id`))
    })
}
function getStateByGuild(guild) {
    return new Promise((resolve, reject) => {
        let q = `SELECT g.id, g.game_name, g.guild_id, g.cpp, g.bpp, g.rerolls, g.last_phase, g.started_at, g.op_id, g.ban_count,
                s.embed_id, s.pick_msgs, s.civs, s.banned, s.picked, s.dlcs, s.disabled,s.disabledDLCs
                FROM games AS g 
                JOIN game_states AS s ON g.id=s.game_id
                WHERE guild_id='${guild.id}' ORDER BY g.id DESC LIMIT 1`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  GET getStateByGuild\n${err}`)
                reject(new Error(`Failed  GET getStateByGuild\n${err}`))
            }
            else {
                if (res[0])
                    fetchPlayerStates(res[0].id).then(players => {
                        resolve(new State(res[0], players))
                    })
                else
                    resolve()
            }
        })
    })
}
function fetchGameState(gameId) {
    return new Promise((resolve, reject) => {
        let q = `SELECT g.id, g.game_name, g.guild_id, g.cpp, g.bpp, g.rerolls, g.last_phase, g.started_at, g.op_id, g.ban_count,
        s.embed_id, s.pick_msgs, s.civs, s.banned, s.picked, s.dlcs, s.disabled,s.disabledDLCs
        FROM games AS g 
        JOIN game_states AS s ON g.id=s.game_id
        WHERE id='${gameId}'`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  GET game\n${err}`)
                reject(new Error(`Failed  GET game\n${err}`))
            }
            else {
                logger.log('db', `succ  GET game`)
                if (res[0])
                    resolve(res[0])
                else
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(new Error(`no state found`))
            }
        })
    })
}
function fetchPlayerStates(gameId) {
    return new Promise((resolve, reject) => {
        let q = `SELECT player_id, player_slot, re_vote, bans, civs, pick FROM player_states WHERE game_id='${gameId}'`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  GET players\n${err}`)
                reject(new Error(`Failed  GET players\n${err}`))
            }
            else {
                logger.log('db', `succ  GET players`)
                resolve(res)
            }
        })
    })
}

function addFastGame(guildId) {
    return new Promise((resolve, reject) => {
        let q = `UPDATE guilds SET 
        fast_count=fast_count + 1,
        last_fast='${new Date().toISOString().slice(0, 19).replace('T', ' ')}'
        WHERE id='${guildId}'`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  SET addFastGame\n${err}`)
                reject(new Error(`Failed  SET addFastGame\n${err}`))
            }
            else {
                logger.log('db', `succ  SET addFastGame`)
                resolve()
            }
        })
    })
}

function getLastGameTime(guildId) {
    return new Promise((resolve, reject) => {
        let q = `SELECT started_at FROM games WHERE guild_id='${guildId}' ORDER BY started_at DESC LIMIT 1`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getLastGameTime\n${err}`)
                reject(new Error(`Failed  getLastGameTime\n${err}`))
            }
            else {
                logger.log('db', `succ  getLastGameTime`)
                if (res[0])
                    resolve(res[0][`started_at`])
                else
                    resolve(new Date(1))
            }
        })
    })
}


//----

function getGuildConfig(guildId) {
    return new Promise((resolve, reject) => {
        let q = `SELECT prefix, last_fast AS lastFast, allow_getrole AS allowGetrole, role_id AS roleId, channel_id AS channelId, locales, configured, news, game_count as gameCount, fast_count as fastCount
        FROM guilds WHERE id='${guildId}' `
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getGuildConfig\n${err}`)
                reject(new Error(`Failed  getGuildConfig\n${err}`))
            }
            else {
                logger.log('db', `succ  getGuildConfig`)
                resolve(res[0])
            }
        })
    })
}

function updateGuildConfig(guildId, oldConfig, options) {
    let keys = []
    if ('allowGetrole' in options)
        keys.push(`allow_getrole=${options[`allowGetrole`] ? `TRUE` : `FALSE`}`)
    if ('roleId' in options)
        keys.push(`role_id='${options[`roleId`]?.replace(/'/gmu, `\\'`)}'`)
    if ('channelId' in options)
        keys.push(`channel_id='${options[`channelId`]?.replace(/'/gmu, `\\'`)}'`)
    if ('locale' in options)
        keys.push(`locales='${options[`locale`]?.replace(/'/gmu, `\\'`)}'`)
    if ('name' in options)
        keys.push(`name='${options[`name`]?.replace(/'/gmu, `\\'`)}'`)
    if ('prefix' in options)
        keys.push(`prefix='${options[`prefix`]?.replace(/'/gmu, `\\'`)}'`)
    if ('kicked' in options)
        keys.push(`kicked=${options[`kicked`] ? `TRUE` : `FALSE`}`)
    if ('configured' in options)
        keys.push(`configured=${options[`configured`] ? `TRUE` : `FALSE`}`)
    if ('news' in options)
        keys.push(`news=${options[`news`] ? `TRUE` : `FALSE`}`)
    if ('avatar' in options)
        keys.push(`avatar='${options[`avatar`]?.replace(/'/gmu, `\\'`)}'`)
    return new Promise((resolve, reject) => {
        if (keys.length == 0) {
            reject(new Error(`No updateGuildConfig options given`))
            return
        }
        let q = `UPDATE guilds SET ${keys.join(`,`)}
        WHERE id='${guildId}' `
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  updateGuildConfig\n${err}`)
                reject(new Error(`Failed  updateGuildConfig\n${err}`))
            }
            else {
                logger.log('db', `succ  updateGuildConfig`)
                resolve(res[0])
            }
        })
    })
}

function createGuildConfig(guild) {
    return new Promise((resolve, reject) => {
        let q = `INSERT guilds(
                id,
                name,
                joined_at,
                configured,
                prefix,
                role_id,
                channel_id,
                allow_getrole,
                game_count,
                fast_count,
                last_fast,
                locales,
                kicked
            ) VALUES (
                '${guild.id}',
                '${guild.name}',
                '${new Date().toISOString().slice(0, 19).replace('T', ' ')}',
                FALSE,
                '!',
                NULL,
                NULL,
                TRUE,
                0,
                0,
                '${new Date(1000).toISOString().slice(0, 19).replace('T', ' ')}',
                'en',
                FALSE
        )`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  createGuildConfig\n${err}`)
                reject(new Error(`Failed  createGuildConfig\n${err}`))
            }
            else {
                logger.log('db', `succ  createGuildConfig`)
                getGuildConfig(guild.id).then(resolve)
            }
        })
    })
}

function getPressences() {
    return new Promise((resolve, reject) => {
        let q = `SELECT * FROM pressences`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getPressences\n${err}`)
                reject(new Error(`Failed  getPressences\n${err}`))
            }
            else {
                logger.log('db', `succ  getPressences`)
                resolve(res)
            }
        })
    })
}
function getStats() {
    return new Promise((resolve, reject) => {
        let q = `SELECT (SELECT COUNT(*) FROM players) AS 'players',
        (SELECT COUNT(*) FROM games) AS 'games',
        (SELECT COUNT(*) FROM guilds) AS 'guilds',
        (SELECT SUM(fast_count) FROM guilds) AS 'fasts'`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getStats\n${err}`)
                reject(new Error(`Failed  getStats\n${err}`))
            }
            else {
                logger.log('db', `succ  getStats`)
                resolve(res[0])
            }
        })
    })
}
function updateDaily() {
    return new Promise((resolve, reject) => {
        let q = `INSERT stats(date,guilds,games,fasts,players) VALUES (
            CURDATE(), (SELECT COUNT(*) FROM guilds WHERE kicked=FALSE), (SELECT COUNT(*) FROM games), (SELECT SUM(fast_count) FROM guilds), (SELECT COUNT(*) FROM players))`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  updateDaily\n${err}`)
                reject(new Error(`Failed  updateDaily\n${err}`))
            }
            else {
                logger.log('db', `succ  updateDaily`)
                resolve()
            }
        })
    })
}

function getAnnounceGuilds() {
    return new Promise((resolve, reject) => {
        let q = `SELECT id,channel_id as channel FROM guilds WHERE news=1 AND kicked=0`
        connection.query(q, (err, res) => {
            if (err) {
                logger.log('error', `Failed  getAnnounceGuilds\n${err}`)
                reject(new Error(`Failed  getAnnounceGuilds\n${err}`))
            }
            else {
                logger.log('db', `succ  getAnnounceGuilds`)
                resolve(res)
            }
        })
    })
}
module.exports = {
    civLists,
    getGamesCount,
    addFastGame,
    newGame,
    getLastGameTime,
    getGuildConfig,
    getState,
    updateGuildConfig,
    getStateByGuild,
    createGuildConfig,
    getPressences,
    getStats,
    updateDaily,
    statesCache,
    getAnnounceGuilds,
}