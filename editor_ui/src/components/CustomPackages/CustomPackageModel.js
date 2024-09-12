import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";

function CustomPackageModel({show, onHide, onSubmit}) {
      const [formData, setFormData] = useState({
        filename: "",
        description: "",
        file: null,
      });
      const [error, setError] = useState("");

       const handleChange = (event) => {
         const { name, value, files } = event.target;
         if (files) {
           const file = files[0];

           // Check if the file size exceeds 5MB (5 * 1024 * 1024 bytes)
           if (file.size > 5 * 1024 * 1024) {
             setError("File size exceeds 5MB. Please select a smaller file.");
             return;
           }

           setFormData((prevData) => ({
             ...prevData,
             filename: file.name,
             [name]: file,
             lastModified: new Date(file.lastModified)  //store the last modified date 
           }));
           setError(""); //clear error if file is within the size limit 
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
             description: "",
             file: null,
           });
         };

  return (
    <Modal
      className="text-white"
      show={show}
      onHide={() => {
        onHide();
      }}
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
                <Form.Label>Choose File</Form.Label>
                <div className="mb-3">
                  <Form.Control
                    type="file"
                    name="file"
                    required
                    onChange={handleChange}
                    accept=".zip"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
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
          {formData.filename && (
            <Form.Group>
              <Form.Label>File Name</Form.Label>
              <div className="mb-3">
                <Form.Control
                  placeholder="file"
                  type="text"
                  value={formData.filename}
                  name="filename"
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          Upload
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomPackageModel
