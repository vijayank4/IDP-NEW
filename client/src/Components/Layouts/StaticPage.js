import React, {Fragment} from 'react'
import Header from './Header';
import LeftSideMenus from './LeftSideMenus';
import PageTitle from './PageTitle';
import Footer from './Footer';

const StaticPage = ({ children, showStaticPage }) => {
  return (
    <Fragment>
        {showStaticPage && (
            <div className="wrapper">
                <Header />
                <LeftSideMenus/>
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <PageTitle/>
                            {children}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )}
    </Fragment>
  )
}

export default StaticPage