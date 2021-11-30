const { db } = require('../service.shared/Repository/Firebase/admin');


/*
    Update User
    updates and return updated user
*/
exports.update = (request, response) => {
    // TODO: validation on input parameters
    
    let merged = {...request.user, ...request.body}

    return db.doc(`/users/${merged.idtoken}`).set(merged).then(() => {
        delete merged.idtoken // do not return token id
        return response.res.json(merged)
    })

    


}
