const truefx = require('truefx')

function getRates(callback) {
    truefx.get('EURUSD').then(callback)
}

module.exports = {
    getRates
}