import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const MyModal = (props) => {

  return (
      <Modal show={props.show} backdrop="static" centered={props.centered} size={props.modalSize}>
        <Modal.Header closeButton onClick={props.handleClickClose} className={`modal-colored-header ${props.headerBgColor}`} >
          <Modal.Title>{props.titleTextName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.bodyContent}</p>
        </Modal.Body>
        <Modal.Footer>
          {props.alertBox ? (<Button className={`btn-${props.buttonSize}`} variant={props.closeBgColor} onClick={props.handleClickClose}>Close
          </Button>) : (<><Button className={`btn-${props.buttonSize}`} variant={props.closeBgColor} onClick={props.handleClickClose}>{props.closeTextName}</Button>
          <Button className={`btn-${props.buttonSize}`} variant={props.saveBgColor} onClick={props.handleClickSave}>
            {props.saveTextName}
          </Button></>)}
        </Modal.Footer>
      </Modal>
  );
};

export default MyModal;