module.exports = {
	nicks: {},
	updateUser: function (whoIsInfo) {
		const id = whoIsInfo.account
		if (id) {
			this.nicks[whoIsInfo.nick] = id
		}
	},
	changeNick: function (oldnick, newnick) {
		this.nicks[newnick] = this.nicks[oldnick]
		this.removeNick(oldnick)
	},
	getAccountByNick: function (nick) {
		return this.nicks[nick]
	},
	removeNick: function (nick) {
		if (!this.nicks.hasOwnProperty(nick))
			return
		if (isNaN(parseInt(nick)) || !(this.nicks instanceof Array))
			delete this.nicks[nick]
		else
			this.nicks.splice(nick, 1)
	},
}