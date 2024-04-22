const crypto = require('crypto');
const { readKey, readCredential, writeCredential } = require('../json_dat');

// Get a credential
const getCredential = async (req, res, next) => {
    readCredential((err, credentials) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users credentials
        const user = credentials[req.username]
        if (!user) {
            res.status(400).send('User does not exist.');
            return;
        }

        // Users specific credential
        const credential = user[req.credentialName]
        if (!credential) {
            res.status(400).send('Credential does not exist.');
        }

        // Process the username
        const username = credential.username.trim();
        //const user_encrypted = crypto.publicEncrypt({ key: publickey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(username));

        // Process the password
        const password = credential.password.trim();
        //const pass_encrypted = crypto.publicEncrypt({ key: publickey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(password));

        // Credentials
        const creds = {
            username: username,
            password: password
        }

        // Send the credentials
        res.send(creds);
    });
}

// Set a credential
const setupCredential = async (req, res, next) => {
    data = req.body; // JSON data from the post request

    username = data.username;
    if (!username) {
        res.status(400).send('Username must be provided.');
        return;
    }

    password = data.password;
    if (!password) {
        res.status(400).send('Password be provided.');
        return;
    }

    readCredential((err, credentials) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users credentials
        const user = credentials[req.username]
        if (!user) {
            res.status(400).send('User does not exist.');
            return;
        }

        // Users specific credential
        const credential = user[req.credentialName]
        if (credential) {
            res.status(400).send('Credential already exists.');
        }

        credentials[req.username][req.credentialName] = {
            username: username,
            password: password
        }
        
        // Write this setup to the credentials
        writeCredential(credentials, (err) => {
            next(err); 
            return;
        });

        // Let the user know it worked
        res.status(200).send("Credential creation complete.")
    });
}

// Delete a credential
const deleteCredential = async (req, res, next) => {
    readCredential((err, credentials) => {
        // If there is an error send it through the error handling middleware
        if (err) {
            next(err);
            return;
        }

        // Users credentials
        const user = credentials[req.username]
        if (!user) {
            res.status(400).send('User does not exist.');
            return;
        }

        // Users specific credential
        const credential = user[req.credentialName]
        if (credential) {
            res.status(400).send('Credential already exists.');
        }

        delete credentials[req.username][req.credentialName];
        
        // Write this setup to the credentials
        writeCredential(credentials, (err) => {
            next(err); 
            return;
        });

        // Let the user know it worked
        res.status(200).send("Credential deletion complete.")
    });
}

module.exports = { getCredential, setupCredential, deleteCredential };