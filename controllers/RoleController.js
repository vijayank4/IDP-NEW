const Role = require('../models/Role');
const Decrypt = require('../models/Decrypt');
const Encrypt = require('../models/Encrypt');

class RoleController {
    getRoleList(req, res) {
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const limitCount = requestData.pageLimit;
            const pageoffset = requestData.startPage === 0 ? 0 : parseInt(requestData.startPage * limitCount);
            const searchText = requestData.searchText;
            const roleCount = Role.getTotalRoleCount(searchText);
            const roleListArr = Role.getRolesList(pageoffset,limitCount,searchText);
            const roundedUp = Math.ceil(roleCount/limitCount);
            req.session.roles = roleListArr;
            req.session.pagecount = roundedUp;
            res.status(200).json(Encrypt.getEncrypt(JSON.stringify({result:req.session, message: "Success"})));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getRoleteFeature(req, res) {
        try {
            const featureArr = Role.getRoleteFeatures();
            res.status(200).json(Encrypt.getEncrypt(JSON.stringify({result:featureArr, message: "Success"})));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    createRole(req, res) {
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const finalResult = Role.createNewRole(requestData.roleData, requestData.featureData);
            res.status(200).json(Encrypt.getEncrypt(finalResult));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getEditFeatureRole (req, res) {
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const editFeatureRoleMapData = Role.getEditFeatureRoleData(requestData.role_id);
            res.status(200).json(Encrypt.getEncrypt(JSON.stringify({result:editFeatureRoleMapData, message: "Success"})));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    updateRole (req, res) {
        try {
            const decryptedData = Decrypt.getDecrypt(req.body);
            const requestData = JSON.parse(decryptedData);
            const finalResult = Role.updateNewRole(requestData.roleData, requestData.featureData);
            res.status(200).json(Encrypt.getEncrypt(finalResult));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new RoleController();