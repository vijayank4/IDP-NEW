const CryptoJS = require('crypto-js');

class Encrypt {
    constructor() {
    // Constructor can be used for initialization if needed
    }
    static getEncrypt(requestData)
    {
        const secretKey = process.env.NODE_APP_SECRET_KEY;
        return CryptoJS.AES.encrypt(requestData, secretKey).toString();
    }
}

module.exports = Encrypt;