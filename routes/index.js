const routes = require('express').Router();
const crypto = require('crypto');

routes.get(
    '/', 
    (req, res) => {
        const { publickey } = req.headers;

        const data = 'HELLO FOOL';
        console.log(publickey)
        const encryptedData = crypto.publicEncrypt({ key: publickey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data))
        
        res.send(encryptedData);
    }
);

module.exports = routes;