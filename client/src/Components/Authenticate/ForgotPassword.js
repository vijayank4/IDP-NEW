import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import innerLogo from '../../Assets/images/logo-inner2.svg'

function ForgotPassword() {
    const routeProject = global.config.ROUTE_NAME;
    const backUrl = routeProject+"/login";
    const titleName = global.config.TITLE_NAME;
    return (
        <div className="account-pages forgotpassword-bg pt-2 pt-sm-5 pb-4 pb-sm-5">
            <Helmet>
                <title>{titleName+" | Reset Password"}</title>
            </Helmet>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-4 col-lg-5">
                        <div className="card">
                            <div className="card-header pt-3 pb-3 text-center">
                                <Link to={backUrl}>
                                    <span><img src={innerLogo} alt="nice" height="40"/></span>
                                </Link>
                            </div>
                            
                            <div className="card-body p-4">
                                
                                <div className="text-center w-75 m-auto">
                                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Reset Password</h4>
                                    <p className="text-muted mb-4">Enter your email address and we'll send you an email with instructions to reset your password.</p>
                                </div>

                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="emailaddress" className="form-label">Email address</label>
                                        <input className="form-control" type="email" id="emailaddress" required="" placeholder="Enter your email"/>
                                    </div>

                                    <div className="mb-0 text-center">
                                        <input type="button" className="btn btn-primary" value="Reset Password"/>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12 text-center">
                                <p className="text-muted">Back to <Link to={backUrl} className="text-muted ms-1"><b>Log In</b></Link></p>
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
export default ForgotPassword;