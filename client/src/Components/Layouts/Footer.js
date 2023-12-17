import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                    {currentYear} {global.config.INDUSTRY_NAME} 
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;