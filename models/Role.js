const db = require('../database'); 
const sqlstring = require('sqlstring');

class Role {
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
    static getRolesList(spage, limit, searchText)
    {
        let searchTextCond = '';
        if(searchText !== null)
        {
        searchTextCond = "WHERE (er_role_name like '%"+searchText+"%' OR er_display_name like '%"+searchText+"%')";
        }
        db.query(`set @rownum := ${spage}`);
        const selectRoleQry = `SELECT @rownum := @rownum + 1 as run_id, er_role_id as role_id, 
                                    er_role_name as role_name,
                                    er_display_name as display_name,
                                    er_role_desc as role_description,
                                    er_free_role as free_role, 
                                    er_role_status as role_status,
                                    er_project_id as project_id
                                FROM epo_role
                                ${searchTextCond}
                                limit ${spage},${limit}`;
        const roleArr = db.query(selectRoleQry);
        return roleArr;
    }
    static getTotalRoleCount(searchText)
    {
        let searchTextCond = '';
        if(searchText !== null)
        {
        searchTextCond = "WHERE (er_role_name like '%"+searchText+"%' OR er_display_name like '%"+searchText+"%')";
        }
        const selectRoleCntQry = `SELECT count(*) as totalcount
                                FROM epo_role
                                ${searchTextCond}`;
        const roleCntArr = db.query(selectRoleCntQry);
        return roleCntArr[0]['totalcount'];
    }
    static getRoleteFeatures()
    {
        const resultArr = new Array();
        const featureRoleMapArr = new Array();
        const selectFeatureQry = `SELECT ef_feature_id as feature_id, ef_feature_name as feature_name, 
                                        ef_display_name as display_name, ef_parent_id as parent_id, ef_feature_type as feature_type
                                FROM epo_feature 
                                WHERE ef_feature_type = '1' 
                                AND ef_status = '1' 
                                ORDER BY ef_menu_order ASC`;
        const featureArr = db.query(selectFeatureQry);   
        featureArr.forEach((item, index) => {
            const selectSubFeatureQry = `SELECT ef_feature_id as feature_id, ef_feature_name as feature_name, 
                                                ef_display_name as display_name, ef_parent_id as parent_id,
                                                ef_feature_type as feature_type
                                        FROM epo_feature 
                                        WHERE ef_parent_id = ${item.feature_id}
                                        ORDER BY ef_menu_order ASC`;
            const subFeatureArr = db.query(selectSubFeatureQry);
            item['sub_feature'] =  subFeatureArr;
            resultArr[index] = item;
        });
        return resultArr;     
    }
    static createNewRole(roleData, featureData)
    {
        //console.log(featureData)
        const chkRoleQry = `SELECT  count(*) as recordcnt FROM epo_role 
                                    where er_role_name=${sqlstring.escape(roleData.rolename)}`;
        const chkRoleArr = db.query(chkRoleQry);
        if(chkRoleArr[0]['recordcnt'] === 0)
        {
            const insertRoleQry = `INSERT INTO epo_role 
                                        (
                                            er_project_id,
                                            er_role_name,
                                            er_display_name,
                                            er_role_desc,
                                            er_free_role,
                                            er_role_status
                                        )
                                        VALUES 
                                        (
                                            ${sqlstring.escape(roleData.project)},
                                            ${sqlstring.escape(roleData.rolename)},
                                            ${sqlstring.escape(roleData.displayname)},
                                            ${sqlstring.escape(roleData.description)},
                                            ${sqlstring.escape(roleData.free_role === true ? 1 : 0)},
                                            ${sqlstring.escape(roleData.role_status === true ? 1 : 0)}
                                        )`;
            const insertRoleRst = db.query(insertRoleQry);
            if(Object.keys(featureData).length > 0)
            {
                const role_id = insertRoleRst.insertId;
                let insertFeatureRoleMapQry = `INSERT INTO epo_feature_role_map 
                                        (
                                            efrm_feature_id, 
                                            efrm_role_id,
                                            efrm_created_user,
                                            efrm_created_date,
                                            efrm_modified_user,
                                            efrm_modified_date,
                                            efrm_project_id,
                                            efrm_status
                                        )
                                        VALUES`;
                                        let fMapValueQry = '';
                                        Object.entries(featureData).forEach(([pindex, pitem]) => {
                                            fMapValueQry += `(${sqlstring.escape(pindex)},${sqlstring.escape(role_id)},'1',NOW(),'1',NOW(),${sqlstring.escape(roleData.project)},'1'),`;
                                            if(pitem.length > 0)
                                            {
                                                pitem.forEach(citem => {
                                                    fMapValueQry += `(${sqlstring.escape(citem)},${sqlstring.escape(role_id)},'1',NOW(),'1',NOW(),${sqlstring.escape(roleData.project)},'1'),`;
                                                })
                                            }
                                        })
                insertFeatureRoleMapQry += fMapValueQry.slice(0, -1);
                db.query(insertFeatureRoleMapQry);
            }
            return JSON.stringify({result:1000, message: "Role created successfully"});
        }
        else
        {
            return JSON.stringify({result:1001, message: "Role is already exist"});
        }
    }
    static getEditFeatureRoleData(role_id) {
        const featureRoleMapQry = `SELECT efrm_feature_id as feature_id FROM epo_feature_role_map WHERE efrm_role_id = ${role_id}`;
        const featureRoleMapArr = db.query(featureRoleMapQry);
        return featureRoleMapArr;
    }
    static updateNewRole(roleData, featureData) {
        const updateRoleQry = `UPDATE epo_role 
                                    SET 
                                        er_role_name = ${sqlstring.escape(roleData.rolename)},
                                        er_display_name = ${sqlstring.escape(roleData.displayname)},
                                        er_role_desc = ${sqlstring.escape(roleData.description)},
                                        er_role_status =  ${sqlstring.escape(roleData.role_status === true ? 1 : 0)},
                                        er_free_role = ${sqlstring.escape(roleData.free_role === true ? 1 : 0)}
                                    WHERE er_role_id = ${sqlstring.escape(roleData.role_id)}`;  
		const updateRoleRst = db.query(updateRoleQry);
        if(updateRoleRst)
        {
            const deleteFeatureRoleMapQry = `DELETE FROM epo_feature_role_map 
                                            WHERE efrm_role_id = ${sqlstring.escape(roleData.role_id)}`;
            db.query(deleteFeatureRoleMapQry);
            if(Object.keys(featureData).length > 0)
            {
                let insertFeatureRoleMapQry = `INSERT INTO epo_feature_role_map 
                                        (
                                            efrm_feature_id, 
                                            efrm_role_id,
                                            efrm_created_user,
                                            efrm_created_date,
                                            efrm_modified_user,
                                            efrm_modified_date,
                                            efrm_project_id,
                                            efrm_status
                                        )
                                        VALUES`;
                                        let fMapValueQry = '';
                                        Object.entries(featureData).forEach(([pindex, pitem]) => {
                                            fMapValueQry += `(${sqlstring.escape(pindex)},${sqlstring.escape(roleData.role_id)},'1',NOW(),'1',NOW(),${sqlstring.escape(roleData.project)},'1'),`;
                                            if(pitem.length > 0)
                                            {
                                                pitem.forEach(citem => {
                                                    fMapValueQry += `(${sqlstring.escape(citem)},${sqlstring.escape(roleData.role_id)},'1',NOW(),'1',NOW(),${sqlstring.escape(roleData.project)},'1'),`;
                                                })
                                            }
                                        })
                insertFeatureRoleMapQry += fMapValueQry.slice(0, -1);
                db.query(insertFeatureRoleMapQry);
            }
            return JSON.stringify({result:1000, message: "Role updated successfully"});
        }
        else
        {
            return JSON.stringify({result:1001, message: "Role updation failed"});
        }
    }
}

module.exports = Role;