const users = require('./update')
const auth = require('../service.shared/Repository/Firebase/auth')

module.exports = async function (context, req) {
    await auth(req, context, users.update)
}