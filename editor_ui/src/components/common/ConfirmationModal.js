import React from "react";
import { Modal, Button } from "react-bootstrap";
import { ExclamationTriangle } from "react-bootstrap-icons";

const ConfirmationModal = ({
  show,
  onHide,
  title,
  message,
  onCancel,
  onConfirm,
  confirmButtonText = "OK",
  cancelButtonText = "Cancel"
}) => {
  return (
    <Modal
      className="text-white"
      data-bs-theme="dark"
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <ExclamationTriangle className="text-warning" /> {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelButtonText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
