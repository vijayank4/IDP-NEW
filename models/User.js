// models/User.js
const db = require('../database'); // Import the database connection
const sqlstring = require('sqlstring');
const path = require('path');

class User {
  constructor() {
    // Constructor can be used for initialization if needed
  }
  static runInsert(query) {
    const result = db.query(query);
    result.insertId
  }
  static runSelect(query) {
    const result = db.query(query);
    return result;
  }
  static runUpdate(query) {
    const result = db.query(query);
    result.affectedRows;
  }
  static runDelete(query) {
    const result = db.query(query);
    result.affectedRows;
  }
  static userValidate(username,password) {
    const chkUserQry = `SELECT el_login_id as login_id, el_user_id as user_id, el_last_login as last_login, el_location_id as location_id, el_active as user_active, el_admin_flag as admin_flag FROM epo_login WHERE el_user_id = ${username} and el_password = ${password} LIMIT 1`;
    const chkUserArr = db.query(chkUserQry);
    return chkUserArr;
  }
  static getUserData(userid) {
    const userQry = `SELECT 
                      usinfo.eui_user_id as user_id,
                      usinfo.eui_first_name as first_name, 
                      usinfo.eui_last_name as last_name, 
                      usinfo.eui_location_id as location_id, 
                      usinfo.eui_dob as date_of_birth, 
                      usinfo.eui_emp_id as emp_id,
                      usinfo.eui_image_path as image_path,
                      promap.epum_proj_user_map_id as project_user_map_id, 
                      promap.epum_project_id as project_id, 
                      promap.epum_role_id as role_id,
                      role.er_display_name as role_display_name,
                      login.el_user_id as username,
                      login.el_password as password,
                      usinfo.eui_contact as contact,
                      usinfo.eui_remarks as remarks,
                      location.el_location_name as location_name,
                      usinfo.eui_doj as date_of_join
                    FROM 
                      epo_user_info as usinfo, 
                      epo_project_user_map as promap,
                      epo_login as login,
                      epo_role as role,
                      epo_location as location
                    WHERE 
                      usinfo.eui_user_id = ${userid}
                      AND usinfo.eui_user_id = promap.epum_user_id
                      AND usinfo.eui_user_id = login.el_login_id
                      AND usinfo.eui_location_id = location.el_location_id
                      AND promap.epum_role_id = role.er_role_id`;
    const userArr = db.query(userQry);
    return userArr;
  }
  static getLockStatus(userid)
  {
    const userlockQry = `SELECT
                              el_login_status as loginStatus
                          FROM
                              epo_login
                          WHERE
                              el_login_id = ${userid}`;
    const userLockStatus = db.query(userlockQry);
    return userLockStatus[0]['loginStatus'];
  }
  static getRoleStatus(userid)
  {
    const chkUserRoleQry = `SELECT
                          count(el_login_id) as status 
                          FROM epo_login , epo_project_user_map
                          where epo_login.el_login_id =  epo_project_user_map.epum_user_id 
                          AND el_login_id = ${userid}
                          AND  epo_project_user_map.epum_role_id IN (select er_role_id er_role_id from epo_role where er_free_role = '1')`;
    const userRoleStatus = db.query(chkUserRoleQry);
    return userRoleStatus[0]['status'];
  }
  static updateLoginStatus(userid,status)
  {
    const updateLoginStatusQry = `UPDATE epo_login 
                              SET el_login_status = ${status},
                              el_last_login = NOW()
                            WHERE el_login_id = ${userid}`;
    const updateLoginStatus = db.query(updateLoginStatusQry);
    return updateLoginStatus;
  }
  static getProjectName(projectid)
  {
    const projectQry = `SELECT ep_project_desc as projectname FROM epo_project WHERE ep_project_id = ${projectid}`;
    const projectArr = db.query(projectQry);
    return projectArr[0]['projectname'];
  }
  static getLocationType(locationid,projectid)
  {
    const locTypeQry = `SELECT el_type as types FROM epo_location 
    WHERE el_location_id = ${locationid} AND el_project_id = ${projectid}`;
    const locTypeResult = db.query(locTypeQry);
    return locTypeResult[0]['types'];
  }
  static getRoleFeature(roleid,projectid)
  {
    const userRoleQry = `SELECT ef_action as action
                        FROM epo_feature, epo_feature_role_map
                        WHERE 
                        ef_inmenu = '1'
                        AND efrm_role_id = ${roleid}
                        AND ef_project_id = ${projectid}
                        AND ef_feature_id = efrm_feature_id
                        AND efrm_status = '1' order by ef_menu_order asc,ef_feature_name asc limit 1`;
    const userRoleResult = db.query(userRoleQry);
    const userFeature = process.env.NODE_APP_PROJECT_ROUTER+"/"+userRoleResult[0]['action'];
    return userFeature;
  }
  static getUserRoleFeature(roleid,projectid)
  {
    const userRoleQry = `SELECT ef_action as action, ef_component as component, ef_display_name as display_name, ef_feature_id as feature_id, ef_parent_id as parent_id
                        FROM epo_feature, epo_feature_role_map
                        WHERE 
                        ef_inmenu = '1'
                        AND efrm_role_id = ${roleid}
                        AND ef_project_id = ${projectid}
                        AND ef_feature_id = efrm_feature_id
                        AND efrm_status = '1' order by ef_menu_order asc,ef_feature_name asc`;
    const userRoleResult = db.query(userRoleQry);
    const featureList = [];
    userRoleResult.forEach((result) => {
      if(result['action'] != null && result['action'] != '')
      {
        const featureUrl = "/"+result['action'];
        const component = result['component'];
        const display_name = result['display_name'];
        const feature_id = result['feature_id'];
        const parent_id = result['parent_id'];
        const url = process.env.NODE_APP_PROJECT_ROUTER+"/"+result['action'];
        const routes = { path: featureUrl, component: component, url: url, page_title: display_name, feature_id: feature_id, parent_id:parent_id};
        featureList.push(routes);
      }
    });
    return featureList;
  }
  static getUserRoleMenuList(roleid,projectid)
  {
    const menuListArr = {};
    menuListArr['parent'] = {};
    const userMenuQry = `SELECT ef_feature_id as feature_id, ef_display_name as display_name, ef_feature_icon as display_icon, ef_process_id as process_id, ef_action as action FROM epo_feature, epo_feature_role_map 
                        WHERE ef_feature_type = '1' 
                        AND ef_inmenu='1' 
                        AND efrm_role_id = ${roleid}
                        AND ef_project_id = ${projectid}
                        AND ef_feature_id = efrm_feature_id 
                        AND efrm_status = '1' ORDER BY ef_menu_order ASC`;
    const userMenuResult = db.query(userMenuQry);
    userMenuResult.forEach((result) => {
        const subMenuQuery = `SELECT ef_feature_id as feature_id, ef_parent_id as parent_id, ef_display_name as display_name, ef_feature_icon as display_icon, ef_process_id as process_id, ef_action as action FROM epo_feature, epo_feature_role_map
                            WHERE ef_parent_id = ${result['feature_id']}
                            AND ef_inmenu = '1' 
                            AND ef_status = '1' 
                            AND efrm_role_id =  ${roleid}
                            AND ef_feature_id = efrm_feature_id 
                            AND efrm_status = '1' ORDER BY ef_menu_order ASC`;
        const subMenuResult = db.query(subMenuQuery);
        //console.log(subMenuResult.affectedRows)
        if(subMenuResult.length > 0)
        {
          menuListArr['parent'][result['feature_id']] = {};
          menuListArr['parent'][result['feature_id']] = {"feature_id":result['feature_id'],"display_name":result['display_name'],"icon":result['display_icon']};
          menuListArr['parent'][result['feature_id']]['child'] = {};
          subMenuResult.forEach((subResult) => {
            menuListArr['parent'][subResult['parent_id']]['child'][subResult['feature_id']] = {};
            menuListArr['parent'][subResult['parent_id']]['child'][subResult['feature_id']] = {"parent_id":subResult['parent_id'],"display_name":subResult['display_name'],"process_id":subResult['process_id'],"router_name":subResult['action']};
          }) 
        }
        else
        {
          menuListArr['parent'][result['feature_id']] = {};
          menuListArr['parent'][result['feature_id']] = {"feature_id":result['feature_id'],"display_name":result['display_name'],"icon":result['display_icon'],"router_name":result['action']};
        }
    })
    return menuListArr;     
  }
  static checkRoleStatus(roleid)
  {
    const chkRoleStatusQry = `SELECT er_role_status as role_status FROM epo_role WHERE er_role_id = ${roleid}`;
    const chkRoleStatusResult = db.query(chkRoleStatusQry);
    return chkRoleStatusResult[0]['role_status'];
  }
  static updateLogoutStatus(user_id)
  {
    const updateUserStatusQry = `UPDATE epo_login 
    SET el_login_status = '0',el_last_login = NOW() WHERE el_login_id = ${user_id}`;
    const userStatusResult = db.query(updateUserStatusQry);
    return userStatusResult.affectedRows;
  }
  static getAllUserList(spage, limit, searchText)
  {
    let searchTextCond = '';
    //console.log(searchText)
    if(searchText !== null)
    {
      searchTextCond = "AND (login.el_user_id like '%"+searchText+"%' OR epo_user_info.eui_first_name like '%"+searchText+"%' OR epo_user_info.eui_last_name like '%"+searchText+"%' OR location.el_location_name like '%"+searchText+"%' OR epo_role.er_role_name like '%"+searchText+"%')";
    }
    //console.log(searchText)
    db.query(`set @rownum := ${spage}`);
    const selectUserQry = `SELECT @rownum := @rownum + 1 as run_id, eui_first_name AS first_name,
                              eui_last_name AS last_name,
                              login.el_login_id as login_id,
                              login.el_user_id as user_id,
                              location.el_location_name as location_name,
                              er_role_name AS role_name,
                              er_role_id as role_id,
                              login.el_location_id as location_id,
                              eui_image_path as image_path,
                              eui_contact as contact,
                              eui_dob as dob,
                              eui_doj as doj,
                              eui_cross_trained as cross_trained,
                              eui_remarks as remarks,
                              eui_emp_id as emp_id,
                              login.el_active as user_status
                          FROM epo_login as login,
                          epo_location as location,
                          epo_user_info
                          LEFT JOIN epo_project_user_map
                          ON epo_user_info.eui_user_id = epo_project_user_map.epum_user_id
                          LEFT JOIN epo_role
                          ON epo_project_user_map.epum_role_id = epo_role.er_role_id
                          WHERE eui_user_id=login.el_login_id 
                          and eui_location_id=location.el_location_id
                          ${searchTextCond}
                          limit ${spage},${limit}`;
    const userArr = db.query(selectUserQry);
    return userArr;
  }
  static getTotalUserCount(searchText)
  {
    let searchTextCond = '';
    if(searchText !== null)
    {
      searchTextCond = "AND (login.el_user_id like '%"+searchText+"%' OR epo_user_info.eui_first_name like '%"+searchText+"%' OR epo_user_info.eui_last_name like '%"+searchText+"%' OR location.el_location_name like '%"+searchText+"%' OR epo_role.er_role_name like '%"+searchText+"%')";
    }
    const selectUserCntQry = `SELECT count(*) as totalcount
                            FROM epo_login as login,
                            epo_location as location,
                            epo_user_info
                            LEFT JOIN epo_project_user_map
                            ON epo_user_info.eui_user_id = epo_project_user_map.epum_user_id
                            LEFT JOIN epo_role
                            ON epo_project_user_map.epum_role_id = epo_role.er_role_id
                            WHERE eui_user_id=login.el_login_id 
                            and eui_location_id=location.el_location_id
                            ${searchTextCond}`;
    const userCntArr = db.query(selectUserCntQry);
    return userCntArr[0]['totalcount'];
  }
  static getAllLocation()
  {
    const selectLocationQry = `SELECT el_location_id AS location_id,el_location_name AS location_name,el_shortname AS shortname FROM epo_location WHERE el_status = '1' order by el_location_id`;
    const locationArr = db.query(selectLocationQry);
    return locationArr;
  }
  static getAllRoles()
  {
    const selectRoleQry = `SELECT er_role_id as role_id, er_role_name as role_name, er_display_name as display_name FROM epo_role WHERE er_role_status = '1'`;
    const roleArr = db.query(selectRoleQry);
    return roleArr;
  }
  static getProjects()
  {
    const selectProjectQry = `SELECT ep_project_id as project_id, ep_project_name as project_name FROM epo_project`;
    const projectArr = db.query(selectProjectQry);
    return projectArr;
  }
  static createUser(requestData,file)
  {
    const chkUserQry = `SELECT  count(*) AS recordcnt 
                              FROM epo_user_info 
                              WHERE eui_emp_id = ${sqlstring.escape(requestData.empid)}`;
		const chkUserArr = db.query(chkUserQry);
    if(chkUserArr[0]['recordcnt'] === 0)
    {
      const insertUserQry = `INSERT INTO epo_login
                              (
                                el_user_id,
                                el_password,
                                el_location_id,
                                el_admin_flag,
                                el_active,
                                el_emp_id 
                              )
                              VALUES
                              (
                                ${sqlstring.escape(requestData.userid + requestData.user_extention)},
                                ${sqlstring.escape(requestData.password)},
                                ${sqlstring.escape(requestData.location)},
                                '0', 
                                ${sqlstring.escape(requestData.user_status === 'on' ? 1 : 0)},
                                ${sqlstring.escape(requestData.empid)}
                              )`;
        const uResult = db.query(insertUserQry);
        const login_id = uResult.insertId;
        const insertUserInfoQry = `INSERT INTO epo_user_info
                                    ( 
                                      eui_user_id,
                                      eui_first_name,
                                      eui_last_name,
                                      eui_location_id,
                                      eui_manager_id,
                                      eui_dob,
                                      eui_doj,
                                      eui_remarks,
                                      eui_contact,
                                      eui_emp_id,
                                      eui_cross_trained,
                                      eui_image_path 
                                    )
                                    VALUES
                                    ( 
                                      ${sqlstring.escape(login_id)},
                                      ${sqlstring.escape(requestData.firstname)},
                                      ${sqlstring.escape(requestData.lastname)},
                                      ${sqlstring.escape(requestData.location)},
                                      '0',
                                      ${sqlstring.escape(requestData.dob)},
                                      ${sqlstring.escape(requestData.doj)},
                                      ${sqlstring.escape(requestData.remarks)},
                                      ${sqlstring.escape(requestData.phoneno)},
                                      ${sqlstring.escape(requestData.empid)},
                                      ${sqlstring.escape(requestData.crosstrained)},
                                      ${file ? sqlstring.escape(`profilepic/`+requestData.empid + path.extname(file.originalname)) : `''`}
                                    )`;
      const uInfoResult = db.query(insertUserInfoQry);
      const insertUserMapQry = `INSERT INTO epo_project_user_map
                                  (
                                    epum_project_id,
                                    epum_role_id,
                                    epum_user_id
                                  )
                                  VALUES
                                  (
                                    '1' ,  
                                    ${sqlstring.escape(requestData.role)},
                                    ${sqlstring.escape(login_id)}
                                  )`;
      const useMapResult = db.query(insertUserMapQry);
      if(uResult && uInfoResult && useMapResult)
      {
        return JSON.stringify({result:1000, message: "User created successfully"});
      }
      else
      {
        return JSON.stringify({result:1001, message: "User creation failed"});
      }
    }
    else
    {
      return JSON.stringify({result:1002, message: "User is already exist"});
    }
  }
  static updateUser(requestData,file)
  {
    const updateUserQry = `UPDATE epo_login SET el_location_id = ${sqlstring.escape(requestData.location)}, el_active= ${sqlstring.escape(requestData.user_status === 'on' ? 1 : 0)} WHERE el_login_id = ${sqlstring.escape(requestData.login_id)}`;
    const updateUserRst = db.query(updateUserQry);
    if(updateUserRst)
    {
      const imageUpdate = file ? 'eui_image_path = '+sqlstring.escape('profilepic/'+requestData.empid + path.extname(file.originalname))+',' : '';
      const updateUserInfoQry = `UPDATE epo_user_info SET eui_first_name = ${sqlstring.escape(requestData.firstname)}, eui_last_name = ${sqlstring.escape(requestData.lastname)}, eui_location_id = ${sqlstring.escape(requestData.location)}, eui_cross_trained = ${sqlstring.escape(requestData.crosstrained)}, eui_dob = ${sqlstring.escape(requestData.dob)}, eui_doj = ${sqlstring.escape(requestData.doj)}, eui_remarks = ${sqlstring.escape(requestData.remarks)}, eui_contact = ${sqlstring.escape(requestData.phoneno)}, ${imageUpdate} eui_emp_id = ${sqlstring.escape(requestData.empid)} WHERE eui_user_id = ${sqlstring.escape(requestData.login_id)}`;
      //console.log(updateUserInfoQry)
      const updateUserInfoRst = db.query(updateUserInfoQry);
      if(updateUserInfoRst)
      {
        const updateUserMapQry = `UPDATE epo_project_user_map SET epum_role_id = ${sqlstring.escape(requestData.role)} WHERE epum_user_id = ${sqlstring.escape(requestData.login_id)}`;
        const updateUserMapRst = db.query(updateUserMapQry);
        if(updateUserMapRst)
        {
          return JSON.stringify({result:1000, message: "User updated successfully"});
        }
        else
        {
          return JSON.stringify({result:1001, message: "User updation failed"});
        }
      }
      else
      {
        return JSON.stringify({result:1001, message: "User updation failed"});
      }
    }
    else
    {
      return JSON.stringify({result:1001, message: "User updation failed"});
    }
  }
  static deleteUser(requestData)
  {
    const deleteUserQry = `DELETE FROM epo_login WHERE el_login_id = ${sqlstring.escape(requestData.login_id)}`;
    const deleteUserRst = db.query(deleteUserQry);
    if(deleteUserRst)
    {
      const deleteUserInfoQry = `DELETE FROM epo_user_info WHERE eui_user_id = ${sqlstring.escape(requestData.login_id)}`;
      const deleteUserInfoRst = db.query(deleteUserInfoQry);
      if(deleteUserInfoRst)
      {
        const deleteUserMapQry = `DELETE FROM epo_project_user_map WHERE epum_user_id = ${sqlstring.escape(requestData.login_id)}`;
        const deleteUserMapRst = db.query(deleteUserMapQry);
        if(deleteUserMapRst)
        {
          return JSON.stringify({result:1000, message: "User deleted successfully"});
        }
        else
        {
          return JSON.stringify({result:1001, message: "User deletion failed"});
        }
      }
      else
      {
        return JSON.stringify({result:1001, message: "User deletion failed"});
      }
    }
    else
    {
      return JSON.stringify({result:1001, message: "User deletion failed"});
    }
  }
}

module.exports = User;