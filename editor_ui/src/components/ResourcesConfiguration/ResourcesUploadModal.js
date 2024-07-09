import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";

function ResourcesUploadModal({ show, onHide, onSubmit }) {
  const [formData, setFormData] = useState({
    filename: "",
    file_path: "assets",
    description: "",
    file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        filename: file.name,
        [name]: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setFormData({
      filename: "",
      file_path: "assets",
      description: "",
      file: null,
    });
  };

  return (
    <Modal
      className="text-white"
      show={show}
      onHide={onHide}
      size="lg"
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
          
            <Col>
              <Form.Group>
                <Form.Label>File Name</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    placeholder="file"
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>File Path</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    placeholder="file"
                    type="text"
                    name="file_path"
                    value={formData.file_path}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    placeholder="file"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Control
              type="file"
              name="file"
              required
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          Upload
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResourcesUploadModal;
