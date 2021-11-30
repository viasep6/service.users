const users = require('./get')
const auth = require('../service.shared/Repository/Firebase/auth')

module.exports = async function (context, req) {
    if (req.query.user === undefined) {
        await auth(req, context, users.getUser)
    } else {
        await users.getUserProfile(req, context)
    }
}