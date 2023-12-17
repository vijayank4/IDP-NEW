const User = require('../models/User');
const Decrypt = require('../models/Decrypt');
const Encrypt = require('../models/Encrypt');
const sqlstring = require('sqlstring');

class AuthController {
  login(req, res) {
    try {
      const decryptedData = Decrypt.getDecrypt(req.body);
      const requestData = JSON.parse(decryptedData);
      const username = sqlstring.escape(requestData.username);
      const password = sqlstring.escape(requestData.password);
      const chkUserArr = User.userValidate(username,password);
      if(chkUserArr.length == 1) 
      {
        if(chkUserArr[0]['user_active'] == "1")
        {
          req.session.login_id = chkUserArr[0]['login_id'];
          const userDataArr = User.getUserData(sqlstring.escape(req.session.login_id));
          if(userDataArr.length == "1") 
          {
            req.session.project_id = userDataArr[0]['project_id'];
            req.session.role_id = userDataArr[0]['role_id'];
            const loginStatus = User.getLockStatus(sqlstring.escape(req.session.login_id));
            const roleStatus = User.getRoleStatus(sqlstring.escape(req.session.login_id));
            User.updateLoginStatus(sqlstring.escape(req.session.login_id),1);
            const redirectRouter = User.getRoleFeature(sqlstring.escape(req.session.role_id),sqlstring.escape(req.session.project_id));
            const chkRoleStatus = User.checkRoleStatus(sqlstring.escape(req.session.role_id));
            if(chkRoleStatus == 1)
            {
              if(roleStatus == 1 && loginStatus >= 0)
              {
                res.status(200).json({response: Encrypt.getEncrypt(JSON.stringify({userDetail:req.session, redirectUrl:redirectRouter, message: "Success"}))});
              }
              else if(roleStatus == 0 && loginStatus == 0)
              {
                res.status(200).json({response: Encrypt.getEncrypt(JSON.stringify({userDetail:req.session, redirectUrl:redirectRouter, message: "Success"}))});
              }
              else
              {
                res.status(201).json({ message: "Already user logged in with same details, Please contact help desk."});
                req.session.destroy();
              }
            }
            else
            {
              res.status(201).json({ message: "Role status is De-activated.Please contact to admin."});
              req.session.destroy();
            }
          }
          else 
          {
            res.status(201).json({ message: "No Role or Project Mapped, please contact help desk."});
            req.session.destroy();
          }
        }
      } 
      else 
      {
        res.status(201).json({ message: "Your credentials didn't match. Please try again!."});
      }
    } catch (error) {
      //console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
  logout(req, res)
  {
    try {
      const decryptedData = Decrypt.getDecrypt(req.body);
      const requestData = JSON.parse(decryptedData);
      const user_id = sqlstring.escape(requestData.user_id);
      const loginStatus = User.updateLogoutStatus(user_id);
      if(loginStatus > 0)
      {
        res.status(200).json({message: "Logout Successfully"});
      }
      else
      {
        res.status(201).json({message: "Logout Failed"});
      }
    } catch (error) {
      //console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();