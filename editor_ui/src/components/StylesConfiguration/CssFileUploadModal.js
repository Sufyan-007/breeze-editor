import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";

function CSSModal({ show, onHide, onSubmit }) {
  const [formData, setFormData] = useState({
    css_name: "",
    css_filename: "",
    file_path: "styles",
    description: "",
    css_file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setFormData({
      css_name: "",
      css_filename: "",
      file_path: "",
      description: "",
      css_file: null,
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
        <Modal.Title>Upload CSS File</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>CSS Name</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    placeholder="My Styles"
                    type="text"
                    name="css_name"
                    value={formData.css_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>File Name</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    placeholder="My Styles"
                    type="text"
                    name="css_filename"
                    value={formData.css_filename}
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
                    placeholder="My Styles"
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
                    placeholder="My Styles"
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
              name="css_file"
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

export default CSSModal;
