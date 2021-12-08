const users = require('./create')
const auth = require('../service.shared/Repository/Firebase/auth')

module.exports = async function (context, req) {
    if (req.body.imageUrl) {
        await auth(req, context, users.changeProfileImage)
    } else {
        await users.createUser(req, context)
    }
    
}