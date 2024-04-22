const crypto = require('crypto');
const { readKey, writeKey, writeCredential, writeUsers } = require('../json_dat');

// Get the public key of the server
const getServerKey = async (req, res, next) => {
    readKey((err, keys) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Process the key
        const key = keys.server.public.trim();

        // Send the key
        res.send(key);
    })
}

// Setup the server for first time use
const setupServer = async (req, res, next) => {
    data = req.body; // JSON data from the post request

    // Keys credentials and users to use when setting up
    keys = data.keys;
    credentials = data.credentials;
    users = data.users;

    // In case the user omits any
    if (!keys) {
        keys = {};
    }
    if (!credentials) {
        credentials = {};
    }
    if (!users) {
        users = {};
    }

    // Write this setup to the keys
    writeKey(keys, (err) => {
        next(err); 
        return;
    });

    // Write this setup to the credentials
    writeCredential(credentials, (err) => {
        next(err);
        return;
    });

    // Write this setup to the users
    writeUsers(users, (err) => {
        next(err);
        return;
    });

    // Let the user know it worked
    res.status(200).send("Server setup complete.")
}

// Reset the server
const resetServer = async (req, res, next) => {

    // Generate server keys
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // Key size
        publicKeyEncoding: {
            type: 'pkcs1', // Public key type
            format: 'pem' // Key format
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    // Keys credentials and users to use when setting up
    keys = {
        server: {
            public: publicKey,
            private: privateKey
        }
    };

    // Any credentials which should be predefined
    credentials = {};

    // Any users which should be predefined
    users = {};

    // Write this setup to the keys
    writeKey(keys, (err) => {
        next(err); 
        return;
    });

    // Write this setup to the credentials
    writeCredential(credentials, (err) => {
        next(err);
        return;
    });

    // Write this setup to the users
    writeUsers(users, (err) => {
        next(err);
        return;
    });

    // Let the user know it worked
    res.status(200).send("Server reset complete.")
}

module.exports = { getServerKey, setupServer, resetServer };