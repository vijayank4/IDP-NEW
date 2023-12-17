import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {   
    const userData = useSelector(state => state.objectUser.data[0]);
    const routeProject = global.config.ROUTE_NAME;
    const PUBLIC_URL = global.config.PUBLIC_URL;
    const someValidPath = "#";
    return (
        <div className="navbar-custom">
            <ul className="list-unstyled topbar-menu float-end mb-0">
                <li className="dropdown notification-list d-lg-none">
                    <a className="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href={someValidPath} role="button" aria-haspopup="false" aria-expanded="false">
                        <i className="dripicons-search noti-icon"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
                        <form className="p-3">
                            <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username"/>
                        </form>
                    </div>
                </li>

                <li className="dropdown notification-list">
                    <span className="nav-link" role="button">
                        <i className="dripicons-bell noti-icon"></i>
                    </span>
                </li>
                <li className="notification-list">
                    <span className="nav-link" role="button">
                        <i className="dripicons-message noti-icon"></i>
                    </span>
                </li>

                <li className="dropdown notification-list">
                    <a className="nav-link dropdown-toggle nav-user arrow-none me-0" data-bs-toggle="dropdown" role="button" href={someValidPath} aria-haspopup="false" aria-expanded="false">
                        <span className="account-user-avatar"> 
                            <img alt="nice" className="rounded-circle" src={userData[0]['image_path'] ? PUBLIC_URL+'/'+userData[0]['image_path'] : PUBLIC_URL+'/profilepic/default.png'} />
                        </span>
                        <span>
                            <span className="account-user-name">{userData[0]['first_name']}</span>
                            <span className="account-position">{userData[0]['role_display_name']}</span>
                        </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                        <div className=" dropdown-header noti-title">
                            <h6 className="text-overflow m-0">Welcome !</h6>
                        </div>
                        <Link to={routeProject+"/changepassword"} className="dropdown-item notify-item">
                            <i className="mdi mdi-lock me-1"></i>
                            <span>Change Password</span>
                        </Link>
                        <Link to={routeProject+"/logout"} className="dropdown-item notify-item">
                            <i className="mdi mdi-logout me-1"></i>
                            <span>Logout</span>
                        </Link>
                    </div>
                </li>

            </ul>
            <button className="button-menu-mobile open-left">
                <i className="mdi mdi-menu"></i>
            </button>
            <div className="app-search dropdown d-none d-lg-block">
                <form>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search..." id="top-search"/>
                        <span className="mdi mdi-magnify search-icon"></span>
                        <input type="button" className="input-group-text btn-primary" value="Search"/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Header;
