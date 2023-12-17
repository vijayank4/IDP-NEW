import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toaste from '../Toaste';
import encryption from '../../Cryptojs/Encryption';
import decryption from '../../Cryptojs/Decryption';
import $ from 'jquery';
import toastr from 'toastr';
import SimpleBar from 'simplebar-react';

const EditRoleFeature = (props) => {

    const [showToast, setShowToast] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    const handleClickChildCheckbox = (event) =>{
        event.preventDefault();
        const parentFeatureId = event.target.children[0].getAttribute('parent-feature-id');
        if(event.target.children[0].checked)
        {
            event.target.children[0].checked = false;
        }
        else
        {
            const parentElement = document.querySelector(`[feature-id="${parentFeatureId}"]`);
            if(parentElement !== null)
            {
                if(parentElement.checked)
                {
                    event.target.children[0].checked = true;
                }
                else
                {
                    setShowToast(true);
                    setErrorMsg('Please choose the parent feature!');
                    setTimeout(() => {
                        handleCloseToast();
                    }, 3000);
                }
            }
        }
    }

    const handleClickParentCheckbox = (event) =>{
        const feature_id = event.target.getAttribute('feature-id');
        if(event.target.checked === false)
        {
            const childElement = document.querySelector(`[aria-labelledby="dropdownMenu-${feature_id}"]`);
            if(childElement !== null)
            {
                for (let i = 0; i < childElement.children.length; i++) {
                    childElement.children[i].querySelector(`input[parent-feature-id="${feature_id}"]`).checked = false;
                }
            }
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const onSubmitForm = async (event) => {
        event.preventDefault();
        let parentRoleData = {};
        let childRoleData = [];
        $('#parent_role[type="checkbox"]:checked').each(function() {
            const feature_id = $(this).attr('feature-id');
            parentRoleData[feature_id] = childRoleData;
        })
        $('#child_role[type="checkbox"]:checked').each(function() {
            const parentFeatureId = $(this).attr('parent-feature-id');
            const feature_id = $(this).attr('feature-id');
            if(parentRoleData[parentFeatureId].length === 0)
            {
                childRoleData = [];
                childRoleData.push(feature_id);
                parentRoleData[parentFeatureId] = childRoleData;
            }
            else
            {
                parentRoleData[parentFeatureId] = [...childRoleData, feature_id];
                childRoleData.push(feature_id);
            }
        });
        const errorArr = [];
        for (const key in props.editFormRoleData) {
            if(props.editFormRoleData[key] === '' || (props.editFormRoleData[key] === false && key !== 'free_role'))
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
        console.log(document.getElementsByClassName('is-invalid').length)
        if(document.getElementsByClassName('is-invalid').length === 0 && errorArr.length === 0)
        {
            toastr.remove();
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const postData = JSON.stringify({ roleData:props.editFormRoleData, featureData:parentRoleData });
            console.log(postData)
            const encryptedData = encryption(postData);
            const postUrl = global.config.PUBLIC_URL+'/api/update_role';
            try {
                const response = await axios.post(postUrl, {encryptedData}, {
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
                        toastr.warning('Hi, '+responseJson.message+'!', 'Warning', {
                            timeOut: 3000,
                            progressBar: true,
                            closeButton: true,
                            showMethod: 'slideDown',
                            hideMethod: 'slideUp',
                        });
                    }
                    else 
                    {
                        toastr.error('Hi, '+responseJson.message+'!', 'Error', {
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
        <>
            <Toaste show={showToast} onClose={handleCloseToast} message={errorMsg} bgColor="bg-danger"/>
            <SimpleBar className="mb-3" style={{maxHeight:400,minHeight:300,overflowX:'hidden'}}>
                <div className="row mb-2" style={{minHeight:300}}>
                {props.featureData.length > 0 ? (props.featureData.map((pitem, pindex) => {
                    return (
                        <div key={pindex} className="col-lg-3 mb-2">
                            <div className="checkbox-dropdown"> 
                                <div className="dropdown new-checkdp"> 
                                    <label className="control control-checkbox chk_fnt"> 
                                        <input type="checkbox" id="parent_role" defaultChecked = { props.editFeatureRoleData.find(mitem => mitem.feature_id === pitem.feature_id) ? 'defaultChecked' : ''}  onChange={handleClickParentCheckbox} name="parent_role" feature-id={pitem.feature_id} parent-id={pitem.parent_id} feature-type={pitem.feature_type} className="parentRoleCheckbox chk_algn"/> 
                                        <div className="control__indicator"></div>
                                        <span>{pitem.display_name}</span>
                                    </label>
                                    {pitem.sub_feature.length > 0 && (
                                        <>
                                            <Link data-toggle="dropdown" className="check-Box-arrow dropdown-toggle" role="button" id={`dropdownMenu-${pitem.feature_id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-bs-auto-close="outside"><span className="mdi-icn-pos mdi mdi-chevron-down"></span></Link>
                                            <ul className="dropdown-menu dropdown-menu-end check-drop-menu" aria-labelledby={`dropdownMenu-${pitem.feature_id}`} style={{maxHeight:400}}>
                                                {pitem.sub_feature.map((citem, cindex) => {
                                                    return (
                                                        <li key={cindex}><Link to="#" className="small pad-bt0" parent-feature-id={pitem.feature_id} onClick={handleClickChildCheckbox}><label className="control control-checkbox chk_fnt"><input type="checkbox" id="child_role" defaultChecked = {props.editFeatureRoleData.find(mitem => mitem.feature_id === citem.feature_id) ? 'defaultChecked' : ''} name="child_role" parent-feature-id={pitem.feature_id} feature-id={citem.feature_id} feature-type={citem.feature_type} className="childRoleCheckbox drop-align"/>&nbsp;<div className="control__indicator"></div>{citem.display_name}</label></Link></li>
                                                    )
                                                })}
                                            </ul>
                                        </>
                                    )}
                                </div> 
                            </div>
                        </div>
                    )})) : (
                        <tr key="0"><td className="text-center" colSpan="6">No records founds...</td></tr>
                    )
                }
                </div>
            </SimpleBar>
            <div className="row">
                <div className="col-12 button-list">
                    <button type="submit" onClick={onSubmitForm} disabled={dataLoading} className="btn btn-primary btn-sm"><i className="mdi mdi-content-save-outline me-1"></i>Submit</button>
                    <button onClick={props.handleRoleViewClick} id="backBtn" className="btn btn-light btn-sm"><i className="mdi mdi-arrow-left-bold-circle me-1"></i>Back</button>
                </div>
            </div>
        </>
    )
}

export default EditRoleFeature