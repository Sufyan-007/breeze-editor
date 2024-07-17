import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmationModal = ({ fileName, show, onHide, onDelete }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="text-white"
      data-bs-theme="dark"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        {fileName
          ? `Are you sure you want to delete ${fileName}?`
          : "No file selected."}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
