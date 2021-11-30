const { admin, db } = require('../service.shared/Repository/Firebase/admin');
const { validateSignUpData } = require('../service.shared/Repository/Firebase/validators');

/*
    Create user
    checks if displayName or email is already stored,
    if not, then creates the user and returns the uid.
*/
exports.createUser = (request, response) => {

    const newUser = {
        displayName: request.body.displayName,
        email: request.body.email,
        password: request.body.password,
    };
    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.res.status(400).json(JSON.stringify(errors));


    let userId;
    return db.collection("users").where("displayName", "==", newUser.displayName).limit(1).get().then((data)=> {
        const doc = data.docs[0]

        if (doc !== undefined) {
            return true
        } 
        return false
    }).catch((error) => {
        console.log(error);
    }).then( (exists) => {
        if (exists) {
            return response.res.status(400).json(JSON.stringify({displayName: "display name already exists!"}))
        } 
        return db.collection("users").where("email", "==", newUser.email).limit(1).get().then((data)=> {
            const doc = data.docs[0]
            
            if (doc !== undefined) {
                return true;
            }
            return false
        })
        
    }).then((exists) => {
        if (exists) {
            return response.res.status(400).json(JSON.stringify({email: "email already exists!"}))
        } 

        return admin.auth().createUser({
                                email: newUser.email, 
                                displayName: newUser.displayName,
                                password: newUser.password
                            });
    }).then( (data) => {
        userId = data.uid;
        return userId
    })
    .then( (idtoken) => {
        const userCredentials = {
            displayName: newUser.displayName,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            idtoken
        };
        
        return db
                .doc(`/users/${idtoken}`)
                .set(userCredentials);
    })
    .then(() => {
        console.log("User created", userId);
        return response.res.status(201).json(JSON.stringify({ success: true }));
    })
    .catch((err) => {
        if (err.code === 'auth/email-already-in-use' | err.code === 'auth/email-already-exists') {
            return response.res.status(400).json(JSON.stringify({ email: 'Email already in use' }));
        } else {
            console.log(err);
            return response.res.status(500).json(JSON.stringify({ general: 'Something went wrong, please try again' }));
        }
    });
}