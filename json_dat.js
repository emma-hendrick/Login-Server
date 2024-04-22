const fs = require('fs');

// Paths for keys and credentials
const credentialFile = './credentials.json';
const keyFile = './keys.json';
const userFile = './users.json';

// Function to read data from JSON file
function readDataFromFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err);
        } else {
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (parseError) {
                callback(parseError);
            }
        }
    });
}

// Function to write data to JSON file
function writeDataToFile(filename, jsonData, callback) {
    const jsonString = JSON.stringify(jsonData);
    fs.writeFile(filename, jsonString, 'utf8', callback);
}

// Read credential
function readCredential(callback) {
    readDataFromFile(credentialFile, callback);
}

// Write credential
function writeCredential(data, callback) {
    writeDataToFile(credentialFile, data, callback);
}

// Read key
function readKey(callback) {
    readDataFromFile(keyFile, callback);
}

// Write key
function writeKey(data, callback) {
    writeDataToFile(keyFile, data, callback);
}

// Read user
function readUsers(callback) {
    readDataFromFile(userFile, callback);
}

// Write user
function writeUsers(data, callback) {
    writeDataToFile(userFile, data, callback);
}

module.exports = { readCredential, writeCredential, readKey, writeKey, readUsers, writeUsers }