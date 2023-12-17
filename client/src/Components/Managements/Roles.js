import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';
import AddRole from '../Forms/Role/AddRole';
import EditRole from '../Forms/Role/EditRole';
import AddRoleFeature from '../Forms/Role/AddRoleFeature';
import EditRoleFeature from '../Forms/Role/EditRoleFeature';
import Loader from '../Layouts/Loader';
import RoleListTable from '../Forms/Role/RoleListTable';
import toastr from 'toastr';
import $ from 'jquery';
function Roles() {
    const [editRoleData, setEditRoleData] = useState([]);
    const [editFeatureRoleData, setEditFeatureRoleData] = useState([]);
    const [editFormRoleData, setEditFormRoleData] = useState({
        role_id: '',
        rolename: '',
        displayname: '',
        description: '',
        project: '1',
        role_status: false,
        free_role: false
    });
    const [formRoleData, setFormRoleData] = useState({
        rolename: '',
        displayname: '',
        description: '',
        project: '1',
        role_status: true,
        free_role: false
    });
    const [featureData, setFeatureData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [listView, setListView] = useState(true);
    const [addView, setAddView] = useState(false);
    const [editView, setEditView] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [roleData, setRoleData] = useState([]);
    const [pageOffset, setPageOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const pageLimit = global.config.PAGINATOIN_LIMIT
            const postUrl = global.config.PUBLIC_URL+'/api/get_role_list';
            const postData = JSON.stringify({ startPage: pageOffset,searchText:searchText, pageLimit:pageLimit });
            const encryptedData = encryption(postData);
            try {
                const response = await axios.post(postUrl, {encryptedData}, {
                    onUploadProgress: (uploadProgressEvent) => {
                        const currentProgress = uploadProgressEvent.total/2; // Weighted average
                        $('.slider-progress-bar').css({"width": currentProgress+"%"});
                    },
                    onDownloadProgress: (downloadProgressEvent) => {
                        const completedProgess = (downloadProgressEvent.loaded / downloadProgressEvent.total) * 100;
                        $('.slider-progress-bar').css({"width": completedProgess+"%"});
                    },
                });
                setTimeout(() => {
                    setLoading(false);
                    setDataLoading(false);
                    $('.slider-progress-bar').hide();
                    $('.slider-progress-bar').css({"width": "0%"});
                    const responseJson = JSON.parse(decryption(response.data));
                    setRoleData(responseJson.result.roles)
                    setPageCount(responseJson.result.pagecount);
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
        };
        fetchData();
        
    }, [pageOffset,searchText,navigate]);
    
    useEffect(() => {
        const fetechProject = async () => {
            try {
                const postUrl = global.config.PUBLIC_URL+'/api/get_project';
                const response = await axios.get(postUrl);
                const resultArr = JSON.parse(decryption(response.data));
                setProjectData(resultArr.result);
            } catch (error) {
                toastr.error(error.message+'!', 'Error', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                    showMethod: 'slideDown',
                    hideMethod: 'slideUp',
                });
            }
        };
        fetechProject();
        const fetechFeature = async () => {
            try {
                const postUrl = global.config.PUBLIC_URL+'/api/get_feature';
                const response = await axios.get(postUrl);
                const resultArr = JSON.parse(decryption(response.data));
                setFeatureData(resultArr.result);
            } catch (error) {
                toastr.error(error.message+'!', 'Error', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true,
                    showMethod: 'slideDown',
                    hideMethod: 'slideUp',
                });
            }
        };
        fetechFeature();
    }, [navigate]);    

    const handlePageClick = (event) => {
        setPageOffset(event.selected);
    };

    const handleAddViewClick = (e)=>{
        e.preventDefault();
        setAddView(true);
        setListView(false);
    }

    const handleEditViewClick = async (event)=>{
        event.preventDefault();
        const selectedRoleData = JSON.parse(decryption(event.target.getAttribute('roledata')));
        editFormRoleData.role_status = selectedRoleData.role_status ? true : false;
        editFormRoleData.free_role = selectedRoleData.free_role ? true : false;
        editFormRoleData.rolename = selectedRoleData.role_name;
        editFormRoleData.displayname = selectedRoleData.display_name;
        editFormRoleData.description = selectedRoleData.role_description;
        editFormRoleData.project = selectedRoleData.project_id;
        editFormRoleData.role_id = selectedRoleData.role_id;
        setEditRoleData(selectedRoleData);
        try {
            const postData = JSON.stringify({ role_id: selectedRoleData.role_id});
            const encryptedData = encryption(postData);
            const postUrl = global.config.PUBLIC_URL+'/api/get_feature_role_data';
            const response = await axios.post(postUrl, {encryptedData});
            const resultArr = JSON.parse(decryption(response.data));
            //console.log(resultArr.result)
            setEditFeatureRoleData(resultArr.result);
        } catch (error) {
            toastr.error(error.message+'!', 'Error', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true,
                showMethod: 'slideDown',
                hideMethod: 'slideUp',
            });
        }
        setEditView(true);
        setListView(false);
    }

    const handleRoleViewClick = ()=>{
        setListView(true);
        setAddView(false);
        setEditView(false);
    }

    const handleSearchClick = (event) => {
        event.preventDefault();
        let searchText = $('#search_text').val();
        searchText && setSearchText(searchText);
        setPageOffset(0);
    }

    const handleRereshClick = (event) => {
        event.preventDefault();
        setSearchText('');
        $('#search_text').val('');
        setPageOffset(0);
    }

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ):(
            <div className="row">
                <div className="slider-progress-bar" style={{display:'none',width:0}}> </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            {listView && (
                                <div className="form-group">
                                    <b className="header-title">Role List</b>
                                    <div className="float-end">
                                        <Link role="button" className="btn-success btn-md" onClick={handleAddViewClick}><i className="mdi mdi-plus-circle me-1"></i>Add</Link>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Add Role</b>
                                    </div>
                                </div>
                            )}
                            {editView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Edit Role</b>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            {listView && (
                                <div className="row">
                                    <div className="col-xl-5 mb-2">
                                        <div className="mt-xl-0 d-flex">
                                            <div className="app-search input-group">
                                                <input type="text" className="form-control" defaultValue={searchText} placeholder="Search..."id="search_text" /><span className="mdi mdi-magnify search-icon"></span><input type="button" className="input-group-text btn-primary" onClick={handleSearchClick} defaultValue="Search"/>
                                            </div>
                                            <button className="btn btn-primary ms-2" id="top-search" onClick={handleRereshClick}><span className="mdi mdi-autorenew"></span></button>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 mb-2">
                                        <div className="float-sm-end">
                                        {pageCount > 0 && (
                                            <ReactPaginate
                                                pageCount={pageCount}
                                                pageRangeDisplayed={1}
                                                marginPagesDisplayed={1}
                                                onPageChange={handlePageClick}
                                                pageClassName={dataLoading === true ? 'page-item disabled' : 'page-item'}
                                                containerClassName="pagination"
                                                pageLinkClassName="page-link"
                                                previousClassName={dataLoading === true ? 'page-item disabled' : 'page-item'}
                                                breakLinkClassName="page-link"
                                                breakClassName={dataLoading === true ? 'page-item disabled' : 'page-item'}
                                                nextClassName={dataLoading === true ? 'page-item disabled' : 'page-item'}
                                                previousLinkClassName="page-link"
                                                nextLinkClassName="page-link"
                                                disabledClassName="disabled"
                                                activeClassName="active page-item"
                                                forcePage={dataLoading === false && pageOffset}
                                            />
                                        )}
                                        </div>
                                    </div>
                                    <div className="col-sm-12 mt-1">
                                        <div className="table-responsive">
                                            <RoleListTable roleData={roleData} handleEditViewClick={handleEditViewClick} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <AddRole projectData={projectData} formRoleData={formRoleData} setFormRoleData={setFormRoleData} />
                            )}
                            {editView && (
                                <EditRole projectData={projectData} editFormRoleData={editFormRoleData} setEditFormRoleData={setEditFormRoleData} editFeatureRoleData={editFeatureRoleData} editRoleData={editRoleData} />
                            )}
                        </div>
                    </div>
                    {addView && (
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Roles & Permission</b>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <AddRoleFeature formRoleData={formRoleData} featureData={featureData} handleRoleViewClick={handleRoleViewClick}/>
                            </div>
                        </div>
                    )}
                    {editView && (
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Roles & Permission</b>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <EditRoleFeature editFormRoleData={editFormRoleData} editFeatureRoleData={editFeatureRoleData} featureData={featureData} handleRoleViewClick={handleRoleViewClick} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            )}
        </Fragment>
    );
};

export default Roles;
