const crypto = require('crypto');
const { readKey, readUsers, writeKey, writeUsers, readCredential, writeCredential } = require('../json_dat');

// Get a users public key
const getUserKey = async (req, res, next) => {
    readKey((err, keys) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users keys
        const user = keys[req.username]
        if (!user) {
            res.status(400).send('User does not exist.');
            return;
        }

        // Process the key
        const key = user.public.trim();

        // Send the key
        res.send(key);
    });
}

// Setup the users keys
const setupUserKeys = async (req, res, next) => {
    data = req.body; // JSON data from the post request

    keys = data.keys;
    if (!keys) {
        res.status(400).send('Public key must be provided.');
        return;
    }

    publicKey = keys.public;
    if (!publicKey) {
        res.status(400).send('Public key must be provided.');
        return;
    }

    auth_level = data.auth;
    if (!auth_level) {
        res.status(400).send('Auth level must be provided.');
        return;
    }

    readKey((err, keys) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users keys
        const user = keys[req.username]
        if (user) {
            // Let the user know they already exist lol
            res.status(400).send('User must not already exist.')
            return;
        }

        keys[req.username] = {
            public: publicKey
        }
        
        // Write this setup to the keys
        writeKey(keys, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // On to the next part of the stack!
        next();
    })
}

// Setup the users credentials
const setupUserCredentials = async (req, res, next) => {
    readCredential((err, credentials) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users credentials
        const user = credentials[req.username]
        if (user) {
            // Let the user know they already exist lol
            res.status(400).send('User must not already exist.')
            return;
        }

        // Create an empty credential obj for them
        credentials[req.username] = {}
        
        // Write this setup to the keys
        writeCredential(credentials, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // On to the next part of the stack!
        next();
    })
}

// Setup the user
const setupUser = async (req, res, next) => {
    data = req.body; // JSON data from the post request

    // Already verified during key setup
    auth_level = data.auth;

    readUsers((err, users) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users data
        const user = users[req.username]
        if (user) {
            // Let the user know they already exist
            res.status(400).send('User must not already exist.');
            return;
        }

        users[req.username] = {
            auth: auth_level
        }
        
        // Write this setup to the users
        writeUsers(users, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // Let the user know it worked
        res.status(200).send("User creation complete.")
    })
}

// Delete the users Keys
const deleteUserKeys = async (req, res, next) => {
    readKey((err, keys) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users keys
        const user = keys[req.username]
        if (user) {
            // Delete the user
            delete keys[req.username]
        }
        
        // Write this setup to the keys
        writeKey(keys, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // On to the next part of the stack!
        next();
    })
}

// Delete the users Keys
const deleteUserCredentials = async (req, res, next) => {
    readCredential((err, credentials) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users keys
        const user = credentials[req.username]
        if (user) {
            // Delete the user
            delete credentials[req.username]
        }
        
        // Write this setup to the keys
        writeCredential(credentials, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // On to the next part of the stack!
        next();
    })
}

// Delete the user
const deleteUser = async (req, res, next) => {
    readUsers((err, users) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // User
        const user = users[req.username]
        if (user) {
            // Delete the user
            delete users[req.username]
        }
        
        // Write this setup to the keys
        writeUsers(users, (err) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                console.log(err);
                return;
            }
        });

        // Let the user know it worked
        res.status(200).send("User deletion complete.")
    })
}

module.exports = { getUserKey, setupUserKeys, setupUserCredentials, setupUser, deleteUserKeys, deleteUserCredentials, deleteUser };