import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CSSModal({ show, onHide, mode, initialData, onSubmit }) {
  const [cssName, setCssName] = useState("");
  const [cssType, setCssType] = useState("css_content");
  const [cssContent, setCssContent] = useState("");
  const [cssFile, setCssFile] = useState(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setCssName(initialData.css_name);
      setCssContent(initialData.content || "");
    } else {
      resetForm();
    }
  }, [initialData, mode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("css_name", cssName);
    if (cssType === "css_content") {
      formData.append("css_content", cssContent);
    } else if (cssFile) {
      formData.append("css_file", cssFile);
    }
    onSubmit(formData, mode);
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setCssName("");
    setCssContent("");
    setCssType("css_content");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "view"
            ? "View CSS"
            : mode === "edit"
            ? "Edit CSS"
            : "Add CSS"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {mode !== "view" && (
          <>
            <Form.Group>
              <Form.Label>CSS Name</Form.Label>
              <Form.Control
                placeholder="My Styles"
                type="text"
                value={cssName}
                onChange={(e) => setCssName(e.target.value)}
                disabled={mode === "edit"}
              />
            </Form.Group>
            <Form.Group>
              <div className="d-flex my-2">
                <div className="px-2">
                  <Form.Check
                    type="radio"
                    label="CSS Content"
                    name="cssType"
                    id="cssContent"
                    checked={cssType === "css_content"}
                    onChange={() => setCssType("css_content")}
                  />
                </div>
                <Form.Check
                  type="radio"
                  label="CSS File"
                  name="cssType"
                  id="cssFile"
                  checked={cssType === "css_file"}
                  onChange={() => setCssType("css_file")}
                />
              </div>
              {cssType === "css_content" ? (
                <Form.Control
                  as="textarea"
                  placeholder="Add your CSS here.."
                  rows={10}
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                />
              ) : (
                <Form.Control
                  type="file"
                  onChange={(e) => setCssFile(e.target.files[0])}
                />
              )}
              {mode === "edit" && cssType === "css_file" && (
                <div className="text-danger my-2">
                  <p>
                    Note : Uploading CSS File will overwrite existing content.
                  </p>
                </div>
              )}
            </Form.Group>
          </>
        )}
        {mode === "view" && (
          <>
            <Form.Group>
              <Form.Label>CSS Name</Form.Label>
              <Form.Control type="text" value={initialData.css_name} disabled />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>CSS Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={initialData.content}
                disabled
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {mode !== "view" && (
          <Button variant="primary" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CSSModal;
