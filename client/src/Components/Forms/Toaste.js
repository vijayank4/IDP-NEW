import React from 'react';
import { Toast } from 'react-bootstrap';

const Toaste = ({ show, onClose, message, bgColor }) => {

    return (
        <div className="col-lg-3">
            <Toast show={show} onClose={onClose} className={`${bgColor} mb-2 position-absolute top-0 start-50 translate-middle`}>
                <Toast.Body className="text-white">{message}<button type="button" className="btn-close float-end" aria-label="Close" onClick={onClose} data-dismiss="toast"></button></Toast.Body>
            </Toast>
        </div>
    );
};

export default Toaste