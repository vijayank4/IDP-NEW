const fs = require('fs');
const Encrypt = require('../models/Encrypt');
const Decrypt = require('../models/Decrypt');
const xml2js = require('xml2js');
const xmlFormatter = require('xml-formatter');

class ConfigController {
    getConfigJson(req, res) {
        try {
            const xmlFilePath = 'app_config.xml';
            fs.readFile(xmlFilePath, 'utf-8', (err, data) => {
                xml2js.parseString(data, { explicitArray: false }, (parseErr, result) => {
                    console.log(parseErr)
                    req.session.config = result.app_config;
                    res.status(200).json(Encrypt.getEncrypt(JSON.stringify({data:req.session, message: "Success"})));
                });
            });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    updateConfig(req, res){
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const xmlFilePath = 'app_config.xml';
            let xmlContent = `<?xml version="1.0" encoding="UTF-8"?><app_config>`;
            for (const key in requestData) {
                const value = requestData[key];
                xmlContent += `<${key}><![CDATA[${value}]]></${key}>`;
            }
            xmlContent += `</app_config>`;
            fs.writeFile(xmlFilePath, xmlContent, (err) => {
                res.status(200).json(Encrypt.getEncrypt(JSON.stringify({result:1000, message: "Config updated successfully"})));
            });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ConfigController();