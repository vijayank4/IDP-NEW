const Encrypt = require('../models/Encrypt');
const Decrypt = require('../models/Decrypt');
const fs = require('fs');

class EncryptController {
    getImgEncrypt(req, res) {
        try {
            const decryptedImgPath = Decrypt.getDecrypt(req.body);
            const fileContent = fs.readFileSync(decryptedImgPath);
            const encryptedImage = Encrypt.getEncrypt(fileContent);
            res.status(200).json({encryptImgData:encryptedImage});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EncryptController();