// Login.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import encryption from '../Cryptojs/Encryption';
import decryption from '../Cryptojs/Decryption';
import axios from 'axios';
import generateSessionId from '../Session/GenerateSessionId';
import logo from '../../Assets/images/logo.svg';
import toastr from 'toastr';
function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const titleName = global.config.TITLE_NAME;
    useEffect(() => {
        const storedUsername = decryption(localStorage.getItem('rememberedUsername'));
        const storedPassword = decryption(localStorage.getItem('rememberedPassword'));
        const storedRememberMe = localStorage.getItem('rememberMe');
        if (storedRememberMe) {
          setUsername(storedUsername);
          setPassword(storedPassword)
          setRememberMe(true);
        }
    }, []);
    const routeProject = global.config.ROUTE_NAME;
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setTimeout(() => {
            setErrors({errors, message: ''});
        }, 5000)
        if (username.trim() === '') {
            setErrors({errors, errorflag:'true'});
            return;
        }

        if (password.trim() === '') {
            setErrors({errors, errorflag:'true'});
            return;
        }
        try 
        {
            setLoading(true);
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', encryption(username));
                localStorage.setItem('rememberedPassword', encryption(password));
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
                localStorage.removeItem('rememberMe');
            }
            const postUrl = global.config.PUBLIC_URL+'/api/login';
            const postData = JSON.stringify({ username, password });
            const encryptedData = encryption(postData);
            const response = await axios.post(postUrl, { encryptedData });
            if (response.status === 200) 
            {  
                setErrors({errors, eflag: 'true' });
                const data = JSON.parse(decryption(response.data.response));
                generateSessionId(encryption(JSON.stringify(data.userDetail)));
                window.location.href = data.redirectUrl; 
            }
            else
            {
                setLoading(false);
                const data = response.data;
                setErrors({errors, message: data['message'] });
            }
        } catch (error) {
            setLoading(false);
            toastr.error(error.message+'!', 'Error', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true,
                showMethod: 'slideDown',
                hideMethod: 'slideUp',
            });
        }
    };
    return (
        <>
            <Helmet>
                <title>{titleName+" | Login"}</title>
            </Helmet>
            {loading ? (
                <div className="page-loader">
                    <div className="spinner-border spin-loader text-dark" role="status"></div>
                    <span className="cont-loader">Still loading, Just a moment...</span>
                </div>
            ) : errors.eflag ? (
                <div className="page-loader">
                    <div className="spinner-border spin-loader text-dark" role="status"></div>
                    <span className="cont-loader">Still loading, Just a moment...</span>
                </div>
              ) : (
                <div className="auth-fluid">
                    <div className="auth-fluid-form-box">
                        <div className="align-items-center d-flex h-100">
                            <div className="card-body">
                                <div className="auth-brand text-lg-start mb-7">
                                    <img src={logo} alt="nice" loading="lazy" crossOrigin="anonymous" height="35"/>
                                </div>
                                <h4 className="mt-0">Sign In</h4>
                                <p className="text-muted mb-3">Please enter your details to get sign in to your account.</p>
                                {errors.message ? (<div className="alert alert-danger" role="alert"><strong>Error - </strong> {errors.message}</div>) : ''}
                                <form onSubmit={handleLogin} className={`needs-validation ${errors.errorflag ? 'was-validated' : '' }`} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <div className="user-flex">
                                            <span className="mdi mdi-account icon-user"></span>
                                            <input type="text" id="username" placeholder="Enter your username" className={`form-control inp-pad-left`} value={username} onChange={(e)=> setUsername(e.target.value)} required />  
                                            <div className="invalid-feedback">
                                                Username is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <Link to={routeProject+"/forgotpassword"}><span className="text-muted float-end"><small>Forgot your password?</small></span></Link>
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="user-flex">
                                            <span className="mdi mdi-lock icon-user"></span>
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type="password" id="password" className="form-control inp-pad-left" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                                            <div className="input-group-text input-grb-radius" data-password="false">
                                                <span className="password-eye"></span>
                                            </div>
                                            <div className="invalid-feedback">
                                                Password is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input type="checkbox" checked={rememberMe} className="form-check-input" id="checkbox-signin" onChange={() => setRememberMe(!rememberMe)} />
                                            <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                                        </div>
                                    </div>
                                    <div className="d-grid mb-0 text-center">
                                        <button className="btn btn-primary" type="submit"><i className="mdi mdi-login"></i> Log In </button>
                                    </div>
                                </form>
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
            )}
        </>
    );
};

export default Login;
