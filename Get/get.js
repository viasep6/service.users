const { db } = require('../service.shared/Repository/Firebase/admin');



/*
    Get user
    return user profile based on access token
*/
exports.getUser = (request, response) => {
    let userData = {};
	return db
		.doc(`/users/${request.user.idtoken}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
                userData.userCredentials = doc.data();
                delete userData.userCredentials.idtoken // do not send user id back
                return response.res.json(userData);
			} else {
                return response.res.status(404).json(JSON.stringify({ message: "User does not exists!" }));
            }
		})
		.catch((error) => {
			console.error(error);
			return response.res.status(500).json(JSON.stringify({ error: error.code }));
		});
}



/*
    Get user profile
    returns public profile information if exists
*/
exports.getUserProfile = (request, response) => {
    const displayName = request.query.user;
    // to support lowercase lookup, another fields has to be created
    return db.collection("users").where("displayName", "==", displayName).limit(1).get().then((data)=> {
        let doc = data.docs[0]

        if (doc !== undefined && doc.exists) {
            doc = doc.data()
            delete doc.email
            return response.res.json(JSON.stringify(doc))
        }
        return response.res.status(404).json(JSON.stringify({ message: "User does not exists!" }));
        
    }).catch((error) => {
        console.log(error);
        return response.res.status(500).json(JSON.stringify({ error: error.code }));
    })


    
}