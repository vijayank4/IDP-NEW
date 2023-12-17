import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';
import Loader from '../Layouts/Loader';
import UserListTable from '../Forms/User/UserListTable';
import AddUser from '../Forms/User/AddUser';
import EditUser from '../Forms/User/EditUser';
import MyModal from '../Forms/MyModal';
import $ from 'jquery';
import toastr from 'toastr';

function Users() {

    const [locationData , setLocationData] = useState({});
    const [roleData , setRoleData] = useState({});
    const [listView, setListView] = useState(true);
    const [addView, setAddView] = useState(false);
    const [editView, setEditView] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [editUserData, setEditUserData] = useState([]);
    const [pageOffset, setPageOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [deleteUserId, setDeleteUser] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const pageLimit = global.config.PAGINATOIN_LIMIT
            const postUrl = global.config.PUBLIC_URL+'/api/get_user_list';
            const postData = JSON.stringify({ startPage: pageOffset, searchText:searchText, pageLimit:pageLimit });
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
                    setUserData(responseJson.result.users)
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
        const fetecLocation = async () => {
            try {
                const postUrl = global.config.PUBLIC_URL+'/api/get_location';
                const response = await axios.get(postUrl);
                const resultArr = JSON.parse(decryption(response.data));
                setLocationData(resultArr.result);
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
        const fetechRole = async () => {
            try {
                const postUrl = global.config.PUBLIC_URL+'/api/get_roles';
                const response = await axios.get(postUrl);
                const resultArr = JSON.parse(decryption(response.data));
                setRoleData(resultArr.result);
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
        fetecLocation();
        fetechRole();
    }, [navigate]);

    const handlePageClick = (event) => {
        setPageOffset(event.selected);
    };

    const handleAddViewClick = (e)=>{
        e.preventDefault();
        setAddView(true);
        setListView(false);
    }

    const handleEditViewClick = (event)=>{
        event.preventDefault();
        //console.log(event.target.getAttribute('userdata'))
        setEditUserData(JSON.parse(decryption(event.target.getAttribute('userdata'))))
        setEditView(true);
        setListView(false);
    }

    const handleUserViewClick = ()=>{
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
    const handleDeleteClick = (event) => {
        event.preventDefault();
        const user_id = event.target.getAttribute('userid');
        setDeleteUser(user_id);
        setModalShow(true);
    }
    const handleClickClose = (event) =>{
        event.preventDefault();
        setModalShow(false);
    }
    const handleModalDeleteClick = async (event) => {
        event.preventDefault();
        setModalShow(false);
        const postData = JSON.stringify({ login_id: deleteUserId });
        const encryptedData = encryption(postData);
        try {
            setPageOffset(0);
            const postUrl = global.config.API_URL+'/delete_user';
            const response = await axios.post(postUrl, {encryptedData});
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
    return (
        <React.Fragment>
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
                                    <b className="header-title">User List</b>
                                    <div className="float-end">
                                        <Link role="button" className="btn-success btn-md" onClick={handleAddViewClick}><i className="mdi mdi-plus-circle me-1"></i>Add</Link>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Add User</b>
                                    </div>
                                </div>
                            )}
                            {editView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Edit User</b>
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
                                            <UserListTable userData={userData} handleEditViewClick={handleEditViewClick} handleDeleteClick={handleDeleteClick}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <AddUser handleAddPatten="handleAddPatten" locationData={locationData} roleData={roleData} handleUserViewClick={handleUserViewClick} />
                            )}
                            {editView && (
                                <EditUser handleAddPatten="handleAddPatten" locationData={locationData} roleData={roleData} eUserData={editUserData} handleUserViewClick={handleUserViewClick} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            )}
            <MyModal modalSize="md" centered={true} alertBox={false} headerBgColor="bg-info" closeBgColor="light" saveBgColor="info" saveTextName="Yes" closeTextName="No" titleTextName="Alert" bodyContent="Do you want to delete the selected user!" buttonSize="sm" show={modalShow} handleClickSave={handleModalDeleteClick} handleClickClose={handleClickClose}/>   
        </React.Fragment>
    );
};

export default Users;
