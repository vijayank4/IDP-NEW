const CryptoJS = require('crypto-js');

class Decrypt {
    constructor() {
        // Constructor can be used for initialization if needed
    }
    static getDecrypt(requestData)
    {
        const secretKey = process.env.NODE_APP_SECRET_KEY;
        const { encryptedData } = requestData;
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }
}

module.exports = Decrypt;