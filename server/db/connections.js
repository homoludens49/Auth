const monk = require('monk')
const db = monk('localhost/dbformyauth')



module.exports = db