import React from 'react';
import Validation from '../Validation';
import 'toastr/build/toastr.min.css';

const AddRole = (props) => {

    const handleChangeInput = async (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        if(event.target.type === 'text')
        {
            props.setFormRoleData({ ...props.formRoleData, [name]: value});
        }
        else
        {
            props.setFormRoleData({ ...props.formRoleData, [name]: !props.formRoleData[name]});
        }
    }
    return (
        <div className={`row`}>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="rolename" className="form-label">Role Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="rolename" name="rolename" placeholder="Enter the role name" alphabatic="true" numeric="false" alphanumeric="false" onInput={handleChangeInput} onChange={(e) => Validation(e.target,'rolename')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="displayname" className="form-label">Display Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="displayname" name="displayname" placeholder="Enter the display name" alphabatic="true" numeric="false" alphanumeric="false" onInput={handleChangeInput}  onChange={(e) => Validation(e.target,'displayname')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="description" name="description" placeholder="Enter the description" alphabatic="true" numeric="false" onInput={handleChangeInput}  alphanumeric="false" onChange={(e) => Validation(e.target,'description')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="project" className="form-label">Project: <span style={{color:'red'}}>*</span></label>
                    <select className="form-select" defaultValue="1" id="project" name="project" onInput={handleChangeInput}   mandatory="true" onChange={(e) => Validation(e.target,'project')}>
                        <option value="">Select Project</option>
                        {(props.projectData.map((item, index) => {
                            return (
                                <option key={index} value={item['project_id']}>{item['project_name']}</option>
                            );
                        }))}
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <label htmlFor="role_status" className="form-label">Role Status: <span style={{color:'red'}}>*</span></label>
                <div className="checkbox">
                    <label className="control control-checkbox">
                        <input type="checkbox" className="form-check-input" defaultChecked={props.formRoleData.role_status} onInput={handleChangeInput} id="role_status" name="role_status" mandatory="true" onChange={(e) => Validation(e.target,'role_status')}/>
                        <div htmlFor="role_status" className="control__indicator"></div><small htmlFor="role_status" className="smallspace check-span">Active</small>
                    </label>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <label htmlFor="free_role" className="form-label">Free Role: </label>
                <div className="checkbox">
                    <label className="control control-checkbox">
                        <input type="checkbox" className="form-check-input" defaultChecked={props.formRoleData.free_role} onInput={handleChangeInput} id="free_role" name="free_role"/>
                        <div htmlFor="free_role" className="control__indicator"></div><small htmlFor="free_role" className="smallspace check-span">Active</small>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default AddRole