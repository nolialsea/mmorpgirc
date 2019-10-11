const irc = require('irc')
const conf = require('./conf')
const {
	save,
	load
} = require('./saveService')

let data

try {
	data = load(conf.saveFile)
} catch (e) {
	data = {}
}

//save(conf.saveFile, {test: "test"})

let client = new irc.Client(conf.ircServer, conf.nick, {
	channels: [conf.channel],
});

client.addListener('message', function (from, to, message) {
	centauriBot(from, message)
});

client.addListener('error', function (message) {
	console.log('error: ', message);
});

setTimeout(() => {
	//client.say(conf.channel, "Surprise, motherfuckers !")
}, 15000)

function uwuify(message) {
	let msg = ""
	for (let i = 0; i < message.length; i++) {
		msg += i % 2 ? message[i].toLowerCase() : message[i].toUpperCase()
	}
	return "uwu " + msg + " uwu"
}

function centauriBot(from, message){
	if (from === "centauri") {
		client.say(conf.channel, uwuify(message))
	}
}