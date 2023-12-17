import React, { useState, useRef } from 'react';
import axios from 'axios';
import decryption from '../../Cryptojs/Decryption';
import Validation from '../Validation';
import $ from 'jquery';
import toastr from 'toastr';

const EditUser = (props) => {
    const PUBLIC_URL = global.config.PUBLIC_URL;
    const pathSegments = props.eUserData.image_path.split('/');
    const [uploadValue, setUploadValue] = useState(pathSegments[pathSegments.length - 1]);
    const [selectedImage, setSelectedImage] = useState(PUBLIC_URL+'/'+props.eUserData.image_path);
    const fileInputRef = useRef(null);
    const [dataLoading, setDataLoading] = useState(false);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        // Handle the selected file
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
            setUploadValue(selectedFile.name);
        }
        else {
            setSelectedImage(null);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const errorArr = [];
        for (const [ key, value ] of formData.entries()) {
            if(value === '')
            {
                document.getElementById(key).classList.remove("is-valid");
                document.getElementById(key).classList.add("is-invalid");
                errorArr.push(key);
            }
            else
            {
                if(document.getElementById(key) !== null)
                {
                    document.getElementById(key).classList.remove("is-invalid");
                    document.getElementById(key).classList.add("is-valid");
                }
            }
        }
        
        if(document.getElementsByClassName('is-invalid').length === 0 && errorArr.length === 0)
        {
            toastr.remove();
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const postUrl = global.config.PUBLIC_URL+'/api/update_user';
            try {
                const response = await axios.post(postUrl, formData, {
                    onUploadProgress: (uploadProgressEvent) => {
                        const currentProgress = uploadProgressEvent.total/2;
                        $('.slider-progress-bar').css({"width": currentProgress+"%"});
                    },
                    onDownloadProgress: (downloadProgressEvent) => {
                        const completedProgess = (downloadProgressEvent.loaded / downloadProgressEvent.total) * 100;
                        $('.slider-progress-bar').css({"width": completedProgess+"%"});
                    },
                });
                setTimeout(() => {
                    setDataLoading(false);
                    $('.slider-progress-bar').hide();
                    $('.slider-progress-bar').css({"width": "0%"});
                    const responseJson = JSON.parse(decryption(response.data));
                    if(responseJson.result === 1000)
                    {
                        toastr.success('Hi, '+responseJson.message+'!', 'Success', {
                            timeOut: 2000,
                            progressBar: true,
                            closeButton: true,
                            showMethod: 'slideDown',
                            hideMethod: 'slideUp',
                        });
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 3000)
                    }
                    else if(responseJson.result === 1001)
                    {
                        toastr.error('Hi, '+responseJson.message+'!', 'Error', {
                            timeOut: 3000,
                            progressBar: true,
                            closeButton: true,
                            showMethod: 'slideDown',
                            hideMethod: 'slideUp',
                        });
                    }
                    else if(responseJson.result === 1002)
                    {
                        toastr.warning('Hi, '+responseJson.message+'!', 'Warning', {
                            timeOut: 3000,
                            progressBar: true,
                            closeButton: true,
                            showMethod: 'slideDown',
                            hideMethod: 'slideUp',
                        });
                    }
                }, 200); 
            } catch (error) {
                toastr.error(error.message+'!', 'Error', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                    showMethod: 'slideDown',
                    hideMethod: 'slideUp',
                });
            } 
        }
    }
    return (
        <form onSubmit={handleSubmit} className={`row`}>
            <input type="hidden" id="login_id" name="login_id" defaultValue={props.eUserData.login_id}/>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="firstname" className="form-label">First Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="firstname" name="firstname" defaultValue={props.eUserData.first_name} alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'firstname')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="lastname" className="form-label">Last Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="lastname" name="lastname" defaultValue={props.eUserData.last_name} alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'lastname')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="userid" className="form-label">User Id: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="userid" name="userid" defaultValue={props.eUserData.user_id} mandatory="true" onChange={(e) => Validation(e.target,'userid')} readOnly/>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="phoneno" className="form-label">Phone No: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="phoneno" name="phoneno" defaultValue={props.eUserData.contact} maxLength="10" numeric="true" digit="true" onChange={(e) => Validation(e.target,'phoneno')} />
                </div>
            </div>
            <div className="col-md-4 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="datepickers" className="form-label">DOB: <span style={{color:'red'}}>*</span></label>
                    <input className={`form-control`} id="dob" type="date" name="dob" defaultValue={props.eUserData.dob} mandatory="true" onChange={(e) => Validation(e.target,'dob')} />
                </div>
            </div>
            <div className="col-md-4 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="datepickers" className="form-label">DOJ: <span style={{color:'red'}}>*</span></label>
                    <input className={`form-control`} id="doj" type="date" name="doj" defaultValue={props.eUserData.doj} mandatory="true" onChange={(e) => Validation(e.target,'doj')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="remarks" className="form-label">Remarks: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="remarks" name="remarks" defaultValue={props.eUserData.remarks} mandatory="true" onChange={(e) => Validation(e.target,'remarks')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="empid" className="form-label">Emp Id: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="empid" name="empid" defaultValue={props.eUserData.emp_id} alphanumeric="true" onChange={(e) => Validation(e.target,'empid')} readOnly/>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="location" className="form-label">Location: <span style={{color:'red'}}>*</span></label>
                    <select className="form-select" id="location" name="location" defaultValue={props.eUserData.location_id} mandatory="true" onChange={(e) => Validation(e.target,'location')}>
                        <option value="">Select Location</option>
                        {(props.locationData.map((item, index) => {
                            return (
                                <option key={index} value={item['location_id']}>{item['location_name']}</option>
                            );
                        }))}
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="crosstrained" className="form-label">Cross Trained:</label>
                    <select className="form-select" id="crosstrained" name="crosstrained" defaultValue={props.eUserData.cross_trained}  mandatory="true" onChange={(e) => Validation(e.target,'crosstrained')}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="role" className="form-label">Role: <span style={{color:'red'}}>*</span></label>
                    <select className="form-select" id="role" name="role" defaultValue={props.eUserData.role_id}  mandatory="true" onChange={(e) => Validation(e.target,'role')}>
                        <option value="">Select Role</option>
                        {(props.roleData.map((item, index) => {
                            return (
                                <option key={index} value={item['role_id']}>{item['role_name']}</option>
                            );
                        }))}
                    </select>
                </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-lg-6">
                <div className="col-sm-3 mb-2 mt-1">
                    <label htmlFor="status" className="form-label">User Active: <span style={{color:'red'}}>*</span></label>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="user_status" name="user_status" defaultChecked = {props.eUserData.user_status ? 'defaultChecked' : ''} mandatory="true" onChange={(e) => Validation(e.target,'user_status')} />
                        <label className="form-check-label" htmlFor="user_status">
                            Status
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="upload" className="form-label">Upload: <span style={{color:'red'}}>*</span></label>
                    <div className="input-group shadow">
                        <span className="input-group-text px-3 text-muted"><i className="mdi mdi-image-size-select-actual md-20"></i></span>
                        <input type="file" ref={fileInputRef} name="uploadimage" className="d-none" onChange={handleFileChange}/>
                        <input type="text" value={uploadValue} className="form-control browse-input-readonly" placeholder="Upload Image" readOnly />
                        <button className="browse btn btn-primary" type="button" onClick={handleButtonClick}><i className="mdi mdi-image-size-select-actual"></i> Browse</button>
                    </div>
                    <div className ="upload-img-preview"><div className="upload-img-preview-inner"><img src={props.eUserData.image_path === '' ? PUBLIC_URL+'/profilepic/default.png' : selectedImage} alt="Selected" className="image-preview" height="200"/></div></div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 button-list">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={dataLoading}><i className="mdi mdi-content-save-outline me-1"></i>Submit</button>
                    <button onClick={props.handleUserViewClick} id="backBtn" className="btn btn-light btn-sm"><i className="mdi mdi-arrow-left-bold-circle me-1"></i>Back</button>
                </div>
            </div>
        </form>
    )
}

export default EditUser