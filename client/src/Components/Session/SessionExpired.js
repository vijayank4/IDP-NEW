import React from 'react';
import { Link } from 'react-router-dom';
import innerLogo from '../../Assets/images/logo-inner2.svg'

function SessionExpired() {

    const routeProject = global.config.ROUTE_NAME;
    const handleBtnClick = () => {

        window.location.href = routeProject+"/login";
    }
    return (
        <div className="account-pages forgotpassword-bg pt-2 pt-sm-5 pb-4 pb-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-4 col-lg-5">
                        <div className="card">
                            <div className="card-header pt-3 pb-3 text-center">
                                <Link to={routeProject+"/login"}>
                                    <span><img src={innerLogo} alt="nice" height="40"/></span>
                                </Link>
                            </div>

                            <div className="card-body p-4">
                                <div className="text-center">
                                    <span className="mdi mdi-clock-alert-outline md-48"></span>
                                    <h4 className="text-uppercase text-danger mt-3">Session Expired</h4>
                                    <p className="text-muted mt-3">Your session timed out. Please log in again to continue using the app</p>
                                    <button className="btn btn-info mt-3" onClick={handleBtnClick}><i className="mdi mdi-reply"></i> Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer footer-login">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            {new Date().getFullYear()} {global.config.INDUSTRY_NAME}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default SessionExpired;