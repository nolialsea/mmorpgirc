"use strict"

const irc = require('irc')
const sqlite3 = require('sqlite3').verbose()
const conf = require('./conf')
const Player = require('./model/Player')
const Pickaxe = require('./model/Pickaxe')
const userService = require('./service/userService')
const c = require('irc-colors')
const p = require('./tool/print')

const db = new sqlite3.Database('database.sqlite3', initDatabase)
db.serialize()

function initDatabase() {
	//FIXME: ugly way to chain
	Player.init(db, () => {
		Pickaxe.init(db, onDatabaseReady)
	})
}

function getCommands() {
	return [
		require('./command/mine')(db),
		require('./command/stats')(db),
		require('./command/timeLeft')(db),
		require('./command/gold')(db),
	]
}

const commandTool = {
	removeCommandTrigger: (msg) => {
		if (msg.startsWith(conf.commandTrigger)) {
			return msg.substr(conf.commandTrigger.length)
		} else {
			return msg
		}
	}
}

function getPlayerByAccount(account) {
	return new Promise((resolve) => {
		Player.getByAccount(db, account, async (err, player) => {
			if (err) {
				console.log(err)
			} else if (player) {
				resolve(player)
			}else{	
				resolve(null)
			}
		})
	});
}

function getPlayerByNick(nick) {
	return new Promise((resolve) => {
		const account = userService.getAccountByNick(nick)
		if (account) {
			getPlayerByAccount(account).then((player)=>{
				if (player){
					resolve(player)
				}else{
					resolve(null)
				}
			})
		}else{
			resolve(null)
		}
	});
}

async function setPlayerOnline(nick, isOnline){
	const player = await getPlayerByNick(nick)
	if (player){
		player.online = isOnline
		Player.updateUser(db, player, ()=>{})
	}
}

function onDatabaseReady() {
	const commands = getCommands()

	let client = new irc.Client(conf.ircServer, conf.nick, {
		channels: [conf.channel],
	})

	async function processCommand(nick, channel, message, action) {
		const account = userService.getAccountByNick(nick)
		if (account) {
			Player.getByAccount(db, account, async (err, player) => {
				if (err) {
					console.log(err)
				} else if (player) {
					console.log(`<${nick}:${player.account}> ${message}`)
					if (action || message.startsWith(conf.commandTrigger)) {
						for (let command of commands) {
							const result = await command.call(nick, account, commandTool.removeCommandTrigger(message))
							if (result) {
								if (!(result instanceof Array)) {
									console.log(c.stripColorsAndStyle(result))
									client.say(conf.channel, result)
								} else {
									for (let res of result) {
										console.log(c.stripColorsAndStyle(res))
										client.say(conf.channel, res)
									}
								}
							}
						}
					}
				}
			})
		}
	}

	client.addListener('message', (nick, channel, message) => {
		processCommand(nick, channel, message, false)
	})

	client.addListener('action', (nick, channel, message) => {
		processCommand(nick, channel, message, true)
	})

	client.addListener('error', function (message) {
		console.log('error: ', message)
	})

	client.addListener('names', function (channel, nicks) {
		for (let nick in nicks)
			client.whois(nick)
	})

	client.addListener('join', function (channel, nick, message) {
		client.whois(nick)
		setPlayerOnline(nick, true)
	})

	client.addListener('part', function (channel, nick, reason, message) {
		setPlayerOnline(nick, false)
		userService.removeNick(nick)
	})

	client.addListener('quit', function (nick, reason, channels, message) {
		setPlayerOnline(nick, false)
		userService.removeNick(nick)
	})

	client.addListener('kick', function (channel, nick, by, reason, message) {
		setPlayerOnline(nick, false)
		userService.removeNick(nick)
	})

	client.addListener('kill', function (nick, reason, channels, message) {
		setPlayerOnline(nick, false)
		userService.removeNick(nick)
	})

	client.addListener('nick', function (oldnick, newnick, channels, message) {
		userService.changeNick(oldnick, newnick)
	})

	client.addListener('whois', (user) => {
		userService.updateUser(user)
		const account = userService.getAccountByNick(user.nick)
		if (account) {
			(new Player(account)).save(db, (err, msg) => {
				if (err) {
					if (err.errno != 19) {
						throw new Error(JSON.stringify(err))
					}
					//client.say(conf.channel, `Player ${account} joins`)
					setPlayerOnline(nick, true)
				} else {
					client.say(conf.channel, `Player ${p.nick(account)} joins for the first time`)
				}
			})
		}
	})
}