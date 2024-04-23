const routes = require('express').Router();
const { getServerKey, setupServer, resetServer } = require('../controllers/server');
const { getUserKey, setupUserKeys, setupUserCredentials, setupUser, deleteUserKeys, deleteUser } = require('../controllers/user')
const { getCredential, setupCredential, deleteCredential } = require('../controllers/credential')

// Middleware to get a username from route parameters
const extractUser = (req, res, next) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).send('Username is required')
    }

    req.username = username;
    next();
}

// Middleware to get a credential name from route parameters
const extractCredential = (req, res, next) => {
    const credentialName = req.params.credentialname;
    if (!credentialName) {
        return res.status(400).send('Credential name is required')
    }

    req.credentialName = credentialName;
    next();
}

// Route requests for the server, ie, getting the public key from the server
routes.route('/server')
    .get(getServerKey)
    .post(setupServer)
    //.patch(updateServer)
    .delete(resetServer);

// Route requests for credentials, getting, posting, updating, or deleting
routes.route('/credential/:username/:credentialname')
    .all(extractUser)
    .all(extractCredential)
    .get(getCredential)
    .post(setupCredential)
    //.patch(updateCredential)
    .delete(deleteCredential)

// Route requests for users, getting, posting, updating, or deleting
routes.route('/user/:username')
    .all(extractUser)
    .get(getUserKey)
    .post(setupUserKeys, setupUserCredentials, setupUser)
    //.patch(updateUser)
    .delete(deleteUserKeys, deleteUser);

module.exports = routes;