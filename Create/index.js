const users = require('./create')

module.exports = async function (context, req) {
    await users.createUser(req, context)
}