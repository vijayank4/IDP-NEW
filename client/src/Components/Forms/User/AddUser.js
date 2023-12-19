import React, { useState, useRef } from 'react';
import axios from 'axios';
import decryption from '../../Cryptojs/Decryption';
import Validation from '../Validation';
import $ from 'jquery';
import toastr from 'toastr';
import defaultUserImg from '../../../Assets/images/default.png'

const AddUser = (props) => {
    const [uploadValue, setUploadValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
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
                errorArr.push(key);
            }
        }
        
        if(document.getElementsByClassName('is-invalid').length === 0 && errorArr.length > 0)
        {
            toastr.remove();
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const postUrl = global.config.PUBLIC_URL+'/api/create_user';
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
                            timeOut: 3000,
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
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="firstname" className="form-label">First Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="firstname" name="firstname" placeholder="Enter the first name" alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'firstname')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="lastname" className="form-label">Last Name: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="lastname" name="lastname" placeholder="Enter the last name" alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'lastname')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="userid" className="form-label">User Id: <span style={{color:'red'}}>*</span></label>
                    <div className="input-group input-group-merge">
                        <input type="text" autoComplete="off" className={`form-control`} id="userid" name="userid" placeholder="Enter the user id" mandatory="true" alphanumeric="false" onChange={(e) => Validation(e.target,'userid')} />
                        <select className="form-select mw-max-c" id="user_extention" name="user_extention" mandatory="true" onChange={(e) => Validation(e.target,'user_extention')}>
                            <option value="@ninestars.in">@ninestars.in</option>
                            <option value="@ninestar.co.in">@ninestar.co.in</option>
                    </select>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="password" className="form-label">Password: <span style={{color:'red'}}>*</span></label>
                    <div className="input-group input-group-merge">
                        <input type="password" autoComplete="off" className={`form-control`} id="password" name="password" placeholder="Enter the password" passwordpattern="true" onChange={(e) => Validation(e.target,'password')} />
                        <div className="input-group-text input-grb-radius" data-password="false">
                            <span className="password-eye"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="repassword" className="form-label">Re-Password: <span style={{color:'red'}}>*</span></label>
                    <div className="input-group input-group-merge">
                        <input type="password" autoComplete="off" className={`form-control`} id="repassword" name="repassword" placeholder="Enter the re-password" passwordpattern="true" elementname="password" onChange={(e) => Validation(e.target,'repassword')} />
                        <div className="input-group-text input-grb-radius" data-password="false">
                            <span className="password-eye"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="phoneno" className="form-label">Phone No: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="phoneno" name="phoneno" placeholder="Enter the phone no" maxLength="10" numeric="true" digit="true" onChange={(e) => Validation(e.target,'phoneno')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="datepickers" className="form-label">DOB: <span style={{color:'red'}}>*</span></label>
                    <input className={`form-control`} id="dob" type="date" name="dob" defaultValue={new Date().toISOString().split('T')[0]} mandatory="true" onChange={(e) => Validation(e.target,'dob')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="datepickers" className="form-label">DOJ: <span style={{color:'red'}}>*</span></label>
                    <input className={`form-control`} id="doj" type="date" name="doj" defaultValue={new Date().toISOString().split('T')[0]} mandatory="true" onChange={(e) => Validation(e.target,'doj')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="remarks" className="form-label">Remarks: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="remarks" name="remarks" placeholder="Enter the remarks" mandatory="true" onChange={(e) => Validation(e.target,'remarks')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="empid" className="form-label">Emp Id: <span style={{color:'red'}}>*</span></label>
                    <input type="text" className={`form-control`} id="empid" name="empid" placeholder="Enter the employee id" alphanumeric="true" onChange={(e) => Validation(e.target,'empid')} />
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="location" className="form-label">Location: <span style={{color:'red'}}>*</span></label>
                    <select className="form-select" id="location" name="location" mandatory="true" onChange={(e) => Validation(e.target,'location')}>
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
                    <select defaultValue ="0" className="form-select" id="crosstrained" name="crosstrained" mandatory="true" onChange={(e) => Validation(e.target,'crosstrained')}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                    <label htmlFor="role" className="form-label">Role: <span style={{color:'red'}}>*</span></label>
                    <select className="form-select" id="role" name="role" mandatory="true" onChange={(e) => Validation(e.target,'role')}>
                        <option value="">Select Role</option>
                        {(props.roleData.map((item, index) => {
                            return (
                                <option key={index} value={item['role_id']}>{item['role_name']}</option>
                            );
                        }))}
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="mb-2">
                <label htmlFor="user_status" className="form-label">User Active: <span style={{color:'red'}}>*</span></label>
                    <div className="checkbox">
                        <label className="control control-checkbox">
                            <input type="checkbox" className="form-check-input" id="user_status" name="user_status" defaultChecked mandatory="true" onChange={(e) => Validation(e.target,'user_status')}/>
                            <div htmlFor="user_status" className="control__indicator"></div><small htmlFor="user_status" className="smallspace check-span">Active</small>
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
                    <div className ="upload-img-preview"><div className="upload-img-preview-inner"><img src={selectedImage === null ? defaultUserImg : selectedImage} alt="Selected" className="image-preview" height="200"/></div></div>
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

export default AddUser