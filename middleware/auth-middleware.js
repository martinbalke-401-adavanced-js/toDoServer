'use strict';

const Users = require('../models/user-model.js');
const users = new Users();
const jwt = require('jsonwebtoken');

function basicDecode(authString) {
    let base64Buffer = Buffer.from(authString, 'base64'); // base64 buffer conversion of string
    let bufferString = base64Buffer.toString(); // conversion from base64 buffer back to string
    let [username, password] = bufferString.split(':'); // split string using delimiter : to get pieces

    return {
        username: username,
        password: password,
    };
}

async function basicAuth(encodedCredentials) {
    let credentials = basicDecode(encodedCredentials);
    let user = await users.readFromField({ email: credentials.username });

    user = user[0];

    if (user && user._id && (await user.comparePassword(credentials.password)))
        return user;
    else
        return users.create({
            email: credentials.username,
            password: credentials.password,
        });
}

async function bearerAuth(token) {
    let secret = process.env.JWT_SECRET;
    let tokenData;

    try {
        tokenData = jwt.verify(token, secret);
    } catch (e) {
        return { status: 401, message: e.name };
    }

    if (tokenData.data.id) return await users.read(tokenData.data.id);
    else return { status: 401, message: 'Unable to authenticate from token' };
}

module.exports = async (req, res, next) => {
    let auth, authType, authData, user;


    if (req.headers.authorization)
        auth = req.headers.authorization.split(/\s+/);
    if (auth && auth.length == 2) {
        authType = auth[0];
        authData = auth[1];
    }

    if (authType == 'Basic') user = await basicAuth(authData);
    else if (authType == 'Bearer') user = await bearerAuth(authData);

    if (!user) next();
    // error if user.status is set
    else if (user.status) next(user);
    else {
        req.user = user;
        req.token = 'Bearer ' + user.generateToken(req.headers.timeout);
        next();
    }
};
