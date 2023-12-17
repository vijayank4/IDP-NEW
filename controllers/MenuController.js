const User = require('../models/User');
const sqlstring = require('sqlstring');
const Decrypt = require('../models/Decrypt');
const Encrypt = require('../models/Encrypt');

class MenuController {
    getMenuList(req, res) {
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const userRoleArr = User.getRoleFeature(sqlstring.escape(requestData.role_id),sqlstring.escape(requestData.project_id));
            const userMenuArr = User.getAllMenuList(sqlstring.escape(requestData.role_id),sqlstring.escape(requestData.project_id));
            req.session.router_list = userRoleArr;
            req.session.menu_list = userMenuArr;
            res.status(200).json(Encrypt.getEncrypt(JSON.stringify({result:req.session, message: "Success"})));
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MenuController();