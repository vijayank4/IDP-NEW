import React from 'react';
import { useNavigate,useLocation, Link } from 'react-router-dom';

function ModuleNotFound() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = () => {
        navigate(-1);
    };
    return (
        <div className="account-pages forgotpassword-bg pt-2 pt-sm-5 pb-4 pb-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-4 col-lg-5">
                        <div className="card">
                            <div className="card-header pt-3 pb-3 text-center">
                                <Link onClick={goBack}>
                                    <span><img src="/images/logo-inner2.svg" alt="nice" height="40"/></span>
                                </Link>
                            </div>

                            <div className="card-body p-4">
                                <div className="text-center">
                                    <h1 className="text-error">4<i className="mdi mdi-emoticon-sad"></i>4</h1>
                                    <h4 className="text-uppercase text-danger mt-3">That’s an error.</h4>
                                    <p className="text-muted mt-3">The requested URL <code>{location.pathname}</code> was not found on this server.  <ins>That’s all we know.</ins></p>
                                    <Link className="btn btn-info mt-3" onClick={goBack}><i className="mdi mdi-reply"></i> Go Back</Link>
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

export default ModuleNotFound;