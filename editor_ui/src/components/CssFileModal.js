import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CSSModal({ show, onHide, title, content, isEditable, onSubmit }) {
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);
  
  const handleSave = () => {
    onSubmit(editContent);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
      >
        {isEditable ? (
          <Form.Control
            as="textarea"
            rows={10}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <pre>{content}</pre>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {isEditable && (
          <Button variant="primary" onClick={handleSave}>
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CSSModal;
