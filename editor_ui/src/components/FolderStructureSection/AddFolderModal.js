import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddFolderModal = ({ name, show, onHide, onEnterName }) => {
  const [enteredName, setEnteredName] = useState("");

  const handleChange = (e) => {
    setEnteredName(e.target.value);
  };

  const handleEnter = () => {
    onEnterName(enteredName); // pass the entered name to the parent component
    setEnteredName(""); //clear the entered name after passing it
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="text-white"
      data-bs-theme="dark"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Enter Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={enteredName}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleEnter}>
          Enter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFolderModal;
