import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import decryption from '../Cryptojs/Decryption';
import AddConfig from './AddConfig';
import EditConfig from './EditConfig';
import ConfigTableList from './ConfigTableList';
import Loader from '../Layouts/Loader';
import $ from 'jquery';

const Config = () => {
   
    const [listView, setListView] = useState(true);
    const [addView, setAddView] = useState(false);
    const [editView, setEditView] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [configData, setConfigData] = useState([]);
    const [editConfigData, setEditConfigData] = useState([]);
    const [pageOffset, setPageOffset] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const [key, setKey] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            $('.slider-progress-bar').show();
            $('.slider-progress-bar').css({"width": "0%"});
            setDataLoading(true);
            const routeProject = global.config.ROUTE_NAME;
            try {
                setTimeout(() => {
                    setLoading(false);
                    setDataLoading(false);
                    $('.slider-progress-bar').hide();
                    $('.slider-progress-bar').css({"width": "0%"});
                    
                    const itemsPerPage = parseInt(global.config.PAGINATOIN_LIMIT);
                    const startIndex = (parseInt(pageOffset)) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const configJsonData = Object.entries(global.config).filter(([key, value]) => key.toLowerCase().includes(searchText.toLowerCase()));
                    const currentPageData = configJsonData.slice(startIndex, endIndex);
                    setConfigData(currentPageData);
                    setStartIndex(startIndex);
                    const roundedUp = Math.ceil(Object.keys(configJsonData).length/itemsPerPage);
                    setPageCount(roundedUp);
                }, 200); 
            } catch (error) {
                navigate(routeProject+'/servererror');
            } 
        };
        fetchData();
        
    }, [pageOffset,searchText,navigate,key]);

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
        const selectedConfigData = JSON.parse(decryption(event.target.getAttribute('config-data')));
        console.log(selectedConfigData)
        setEditConfigData(selectedConfigData);
        setEditView(true);
        setListView(false);
    }

    const handleConfigViewClick = (event)=>{
        event.preventDefault();
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
        <>
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
                                    <b className="header-title">Config List</b>
                                    <div className="float-end">
                                        <Link role="button" className="btn-success btn-md" onClick={handleAddViewClick}><i className="mdi mdi-plus-circle me-1"></i>Add</Link>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Add Config</b>
                                    </div>
                                </div>
                            )}
                            {editView && (
                                <div className="row">
                                    <div className="col-5">
                                        <b className="header-title">Edit Config</b>
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
                                            <ConfigTableList startIndex={startIndex} configData={configData} handleEditViewClick={handleEditViewClick} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {addView && (
                                <AddConfig handleConfigViewClick={handleConfigViewClick}/>
                            )}
                            {editView && (
                                <EditConfig editConfigData={editConfigData} handleConfigViewClick={handleConfigViewClick}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    )
}

export default Config