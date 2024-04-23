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
            return;
        }

        // Process the username and password
        const username = credential.username.trim();
        const password = credential.password.trim();

        // Encrypt the username and password using the clients public key
        readKey((err, keys) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                next(err);
                return;
            }

            // Get the users public key
            userKeys = keys[req.username]
            if (!userKeys || !userKeys.public) {
                res.status(400).send('User keys do not exist.');
                return;
            }
            publickey = userKeys.public;

            // Encrypt the pass and user
            const user_encrypted = crypto.publicEncrypt({ key: publickey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(username, 'utf8'));
            const pass_encrypted = crypto.publicEncrypt({ key: publickey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(password, 'utf8'));

            // Credentials
            const creds = {
                username: user_encrypted,
                password: pass_encrypted
            }

            // Send the credentials
            res.send(creds);
        });
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
            return;
        }
        
        // Decrypt the username and password using the servers private key
        readKey((err, keys) => {
            // If there is an error send it through the error handling middleware
            if (err) {
                next(err);
                return;
            }

            // Get the servers private key
            serverKeys = keys.server
            if (!serverKeys || !serverKeys.private) {
                res.status(400).send('Server keys do not exist.');
                return;
            }
            privatekey = serverKeys.private;

            // Decrypt the pass and user
            const user_decrypted = crypto.privateDecrypt({ key: privatekey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(username, 'utf8'));
            const pass_decrypted = crypto.privateDecrypt({ key: privatekey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(password, 'utf8'));

            // Save the decrypted credentials
            credentials[req.username][req.credentialName] = {
                username: user_decrypted,
                password: pass_decrypted
            }
            
            // Write this setup to the credentials
            writeCredential(credentials, (err) => {
                next(err); 
                return;
            });
    
            // Let the user know it worked
            res.status(200).send("Credential creation complete.")
        });
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
            return;
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