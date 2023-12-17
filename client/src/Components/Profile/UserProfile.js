import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import Validation from '../Forms/Validation';

const UserProfile = () => {
    const userData = useSelector(state => state.objectUser.data[0]);
    const PUBLIC_URL = global.config.PUBLIC_URL;
    useEffect(() => {
        if(document.getElementsByClassName('page-title')[0] !== undefined)
        {
            document.getElementsByClassName('page-title')[0].textContent = 'Profile';
        }
    },[])

    return (
        <div className="row">
            <div className="col-xl-4 col-lg-5">
                <div className="card text-center mb-3">
                    <div className="card-body">
                        <img alt="nice" src={userData[0]['image_path'] ? PUBLIC_URL+'/'+userData[0]['image_path'] : PUBLIC_URL+'/profilepic/default.png'} className="rounded-circle avatar-lg img-thumbnail" />

                        <h4 className="mb-0 mt-2 mb-1">{userData[0]['first_name']}</h4>
                        <label className="text-muted font-14">{userData[0]['role_display_name']}</label>
                        
                        <div className="text-start mt-3">
                            <h4 className="font-13 text-uppercase mb-2">About us:</h4>
                            <p className="text-muted font-13 mb-3">
                            Ninestars Information Technologies Pvt. Ltd. IT Services and IT Consulting
                            </p>
                            <p className="text-muted mb-2 font-13 text-left"><strong>Full Name :</strong> <span className="ms-2">{userData[0]['first_name'] +' '+userData[0]['last_name']}</span></p>

                            <p className="text-muted mb-2 font-13 text-left"><strong>User Name :</strong> <span className="ms-2 ">{userData[0]['username']}</span></p>

                            <p className="text-muted mb-2 font-13 text-left"><strong>Date of Birth :</strong> <span className="ms-2 ">{userData[0]['date_of_birth']}</span></p>

                            <p className="text-muted mb-2 font-13 text-left"><strong>Date of Join :</strong> <span className="ms-2">{userData[0]['date_of_join']}</span></p>
                            
                            <p className="text-muted mb-2 font-13 text-left"><strong>Mobile :</strong><span className="ms-2">{userData[0]['contact']}</span></p>

                            <p className="text-muted mb-1 font-13 text-left"><strong>Location :</strong> <span className="ms-2">{userData[0]['location_name']}</span></p>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-8 col-lg-7">
                <div className="card">
                    <div className="card-body">
                        <h5 className="mb-4 text-uppercase"><i className="mdi mdi-account-circle me-1"></i> Personal Info</h5>
                        <form className={`row`}>
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="firstname" value="" className="form-label">First Name: <span style={{color:'red'}}>*</span></label>
                                    <input type="text" className={`form-control`} id="firstname" name="firstname" placeholder="Enter first name" alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'firstname')} />
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="lastname" value="" className="form-label">Last Name: <span style={{color:'red'}}>*</span></label>
                                    <input type="text" className={`form-control`} id="lastname" name="lastname" placeholder="Enter last name" alphabatic="true" numeric="false" alphanumeric="false" onChange={(e) => Validation(e.target,'lastname')} />
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="userid" className="form-label">User Id: <span style={{color:'red'}}>*</span></label>
                                    <div className="input-group input-group-merge">
                                        <input type="text" className={`form-control`} id="userid" name="userid" placeholder="Enter user id" mandatory="true" alphanumeric="false" value="" onChange={(e) => Validation(e.target,'userid')} readOnly/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password: <span style={{color:'red'}}>*</span></label>
                                    <div className="input-group input-group-merge">
                                        <input type="password" value="" className={`form-control`} id="password" name="password" placeholder="Enter password" passwordpattern="true" onChange={(e) => Validation(e.target,'password')} />
                                        <div className="input-group-text input-grb-radius" data-password="false">
                                            <span className="password-eye"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="phoneno" className="form-label">Phone No: <span style={{color:'red'}}>*</span></label>
                                    <input type="text" className={`form-control`} id="phoneno" name="phoneno" placeholder="Enter phone no" maxLength="10" numeric="true" digit="true" onChange={(e) => Validation(e.target,'phoneno')} />
                                </div>
                            </div>
                            
                            <div className="col-md-6 col-sm-6 col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="empid" className="form-label">Emp Id: <span style={{color:'red'}}>*</span></label>
                                    <input type="text" className={`form-control`} id="empid" name="empid" placeholder="Enter employee id" alphanumeric="true" onChange={(e) => Validation(e.target,'empid')} readOnly/>
                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-lg-12">
                                <div className="mb-3">
                                    <label htmlFor="remarks" className="form-label">Remarks: <span style={{color:'red'}}>*</span></label>
                                    <textarea type="text" className={`form-control`} id="remarks" name="remarks" placeholder="Enter the remarks" mandatory="true" onChange={(e) => Validation(e.target,'remarks')} />
                                </div>
                            </div>
                            
                            <div className="text-end">
                                <button type="submit" className="btn btn-success mt-2"><i className="mdi mdi-content-save"></i> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
