import React, { useState } from 'react';
import axios from 'axios';
import decryption from '../Cryptojs/Decryption';
import encryption from '../Cryptojs/Encryption';
import Validation from '../Forms/Validation';
import $ from 'jquery';
import toastr from 'toastr';

const EditConfig = (props) => {
    const [dataLoading, setDataLoading] = useState(false);
    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        const pattern = /^[_A-Z]+$/;
        if(name === 'tagname')
        {
          if(pattern.test(value))
          {
              if(document.getElementById(name+'Error'))
              {
                  document.getElementById(name+'Error').remove();
              }
              event.target.classList.remove("is-invalid");
              event.target.classList.add("is-valid");
          }
          else
          {
              if(document.getElementById(name+'Error'))
              {
                  document.getElementById(name+'Error').remove();
              }
              event.target.classList.remove("is-valid");
              event.target.classList.add("is-invalid");
              if(event.target.nextSibling === null)
              {
                  event.target.insertAdjacentHTML('afterend', '<div id="'+name+'Error" class="invalid-feedback">'+capitalizeFirstLetter(name)+' should be alphabatic with capital letter</div>');
              }
          }
        }
    }
    function capitalizeFirstLetter(str)
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const errorArr = [];
        const objectData = {};
        for (const [ key, value ] of formData.entries()) {
            if(formData[key] === '')
            {
                document.getElementById(key).classList.remove("is-valid");
                document.getElementById(key).classList.add("is-invalid");
                errorArr.push(value);
            }
            else
            {
                if(document.getElementById(key) !== null)
                {
                    document.getElementById(key).classList.remove("is-invalid");
                    document.getElementById(key).classList.add("is-valid");
                    objectData[key] = value;
                }
            }
        }
        if(document.getElementsByClassName('is-invalid').length === 0 && errorArr.length === 0)
        {
            global.updateConfig({
                [objectData['tagname']] : objectData['tagvalue']
            });
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const encryptedData = encryption(JSON.stringify(global.config))
            const postUrl = global.config.PUBLIC_URL+'/api/update_config';
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
        <form onSubmit={handleSubmit}>
            <div className={`row`}>
                <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-2">
                        <label htmlFor="tagname" className="form-label">Tag Name: <span style={{color:'red'}}>*</span></label>
                        <input type="text" className={`form-control`} id="tagname" name="tagname" defaultValue={props.editConfigData[0]} placeholder="Enter the tag name" mandatory="true" alphabatic="true" onChange={handleChangeInput} readOnly/>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-2">
                        <label htmlFor="tagvalue" className="form-label">Value: <span style={{color:'red'}}>*</span></label>
                        <input type="text" className={`form-control`} id="tagvalue" name="tagvalue" defaultValue={props.editConfigData[1]} placeholder="Enter the value" mandatory="true" onChange={(e) => Validation(e.target,'tagvalue')} />
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 button-list">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={dataLoading}><i className="mdi mdi-content-save-outline me-1"></i>Submit</button>
                    <button onClick={props.handleConfigViewClick} id="backBtn" className="btn btn-light btn-sm"><i className="mdi mdi-arrow-left-bold-circle me-1"></i>Back</button>
                </div>
            </div>
        </form>
    )
}

export default EditConfig