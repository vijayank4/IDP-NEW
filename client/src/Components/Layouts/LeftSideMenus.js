import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import GetCookies from '../Session/GetCookies';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import LogoSmall from '../../Assets/images/logo-small.png';
import LogoInner from '../../Assets/images/logo-inner.svg';
import { Collapse } from 'react-bootstrap';

function LeftSideMenus() {
    const location = useLocation();
    const menuItem = useSelector(state => state.objectMenus.data[0]);
    const routeItem = useSelector(state => state.objectRouters.data[0]);
    const menuListArr = menuItem['parent'];
    const routeProject = global.config.ROUTE_NAME;
    const titleName = global.config.TITLE_NAME;
    const backUrl = routeItem[0]['url'];
    const matchedItem = routeItem.find(item => item.url === location.pathname);
    const parent_id = matchedItem !== undefined ? matchedItem.parent_id : 0;
    const child_id = matchedItem !== undefined ? matchedItem.feature_id : 0;
    const page_title = matchedItem !== undefined ? matchedItem.page_title : '';
    const [pageTitleName, setPageTitleName] = useState('');
    const [openSection, setOpenSection] = useState(0);
    const [isActive, setIsActive] = useState(0);
    const handleMenuItemClick = (event) => 
    {
        const pageTitle = event.target.getAttribute('data-feature-name');
        setPageTitleName(pageTitle);
        setIsActive(child_id);
    };
    
    useEffect(() => {
        if (parent_id !== 0) {
            setOpenSection(parseInt(parent_id));
        }
        if (child_id !== 0) {
            setIsActive(parseInt(child_id));
        }
        setPageTitleName(page_title);
        if(document.getElementsByClassName('page-title')[0] !== undefined)
        {
            document.getElementsByClassName('page-title')[0].textContent = page_title;
        }
    }, [parent_id,child_id,page_title]);

    const handleToggle = (index) => {
        if (openSection === parseInt(index)) {
            setOpenSection(0);
        } else {
            setOpenSection(parseInt(index));
        }
    };
    return (
        <div className="leftside-menu">
            <Helmet>
                <title>{titleName+" | "+pageTitleName}</title>
            </Helmet>
            <Link to={backUrl} className="logo text-center logo-light">
                <span className="logo-sm">
                    <img src={LogoSmall} alt="" height="22"/>
                </span>
                <span className="logo-lg logo-image">
                    <img src={LogoInner} alt="" height="30"/>
                </span>
            </Link>
            <SimpleBar id="leftside-menu-container">
                <ul className="side-nav">
                    {Object.keys(menuListArr).map((pIndex) => (
                        menuListArr[pIndex]['child'] !== undefined ? (
                            <li key={pIndex} className="side-nav-item">
                                <Link aria-expanded={openSection === parseInt(pIndex) ? 'true' : 'false'} onClick={() => handleToggle(pIndex)} className={`side-nav-link ancor-parent-${pIndex}`}>
                                    <i className={menuListArr[pIndex]['icon']}></i>
                                    <span> {menuListArr[pIndex]['display_name']} </span>
                                    <span className="menu-arrow"></span>
                                </Link>
                                <Collapse in={openSection === parseInt(pIndex)} timeout={300} unmountOnExit>
                                    <div className={`sidebar-line`}>
                                        <ul className="side-nav-second-level">
                                            {Object.keys(menuListArr[pIndex]['child']).map((cIndex) => (
                                                <li key={cIndex} className={isActive === parseInt(cIndex) ? `menuitem-active` : ``}>
                                                    <Link data-location="true" data-feature-name={menuListArr[pIndex]['child'][cIndex]['display_name']} data-parent-id={pIndex} data-feature-id={cIndex} onClick={(e) => handleMenuItemClick(e)} to={GetCookies('access_user') !== undefined ? routeProject+"/"+menuListArr[pIndex]['child'][cIndex]['router_name'] : routeProject+"/login"}><span className="mnu-circle"></span>{menuListArr[pIndex]['child'][cIndex]['display_name']}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Collapse>
                            </li>
                        ) : (
                            <li key={menuListArr[pIndex]} className={isActive === parseInt(pIndex) ? `side-nav-item menuitem-active` : `side-nav-item`}>
                                <Link data-feature-name={menuListArr[pIndex]['display_name']} data-feature-id={pIndex} onClick={(e) => handleMenuItemClick(e)} data-location="true" to={GetCookies('access_user') !== undefined ? routeProject+"/"+menuListArr[pIndex]['router_name'] : routeProject+"/login"} className="side-nav-link"><i className={menuListArr[pIndex]['icon']}></i><span data-feature-name={menuListArr[pIndex]['display_name']} data-feature-id={pIndex}> {menuListArr[pIndex]['display_name']} </span></Link>
                            </li>
                        )   
                    ))}
                </ul>
            </SimpleBar>
        </div>
    );
};

export default LeftSideMenus;