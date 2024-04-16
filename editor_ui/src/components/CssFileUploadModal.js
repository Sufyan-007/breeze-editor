import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CSSModal({ show, onHide, onSubmit }) {
  const [cssName, setCssName] = useState("");
  const [cssFile, setCssFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("css_name", cssName);
    formData.append("css_file", cssFile);
    onSubmit(formData);
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setCssName("");
    setCssFile(null);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Upload CSS File</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        <>
          <Form.Group>
            <Form.Label>CSS Name</Form.Label>
            <div className="mb-3">
              <Form.Control
                placeholder="My Styles"
                type="text"
                value={cssName}
                onChange={(e) => setCssName(e.target.value)}
                required={true}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="file"
              required={true}
              onChange={(e) => setCssFile(e.target.files[0])}
            />
          </Form.Group>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CSSModal;
