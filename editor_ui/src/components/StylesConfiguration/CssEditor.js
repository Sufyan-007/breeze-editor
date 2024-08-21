import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import * as monaco from "monaco-editor";
import { Button, Form, Toast, Row } from "react-bootstrap";
import { router } from "../../App";

function CssEditor({ mode }) {
  const { css_name, projectName } = useParams();
  const [formData, setFormData] = useState({
    css_name: "",
    css_filename: "",
    file_path: "styles",
    description: "",
    css_content: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const editorRef = useRef(null);

  const handleView = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/project-styles/?projectId=${projectName}&css_name=${css_name}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFormData({
          css_name: css_name,
          css_filename: data.css_filename || "",
          file_path: data.file_path || "",
          description: data.description || "",
          css_content: data.css_content || "",
        });
      })
      .catch((error) => {
        setToastMessage("An error occurred while trying to fetch the file.");
        setShowToast(true);
      });
  }, [css_name, projectName]);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      handleView();
    }
  }, [handleView, mode]);

  useEffect(() => {
    const editor = monaco.editor.create(document.getElementById("css-editor"), {
      value: formData.css_content,
      language: "css",
      theme: "vs-dark",
    });
    editorRef.current = editor;

    return () => editor.dispose();
  }, [formData.css_content]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && formData.css_content) {
      editorRef.current.setValue(formData.css_content || "");
    } else {
      editorRef.current.setValue("");
    }
  }, [formData.css_content, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/project-styles/`;
    const payload = JSON.stringify({
      projectId: projectName,
      css_name: formData.css_name,
      css_filename: formData.css_filename,
      file_path: formData.file_path,
      description: formData.description,
      css_content: editorRef.current.getValue(),
    });

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: payload,
      });
      const result = await response.json();
      if (response.status === 200) {
        setToastMessage(
          mode === "add" ? "CSS Added Successfully" : "CSS Updated Successfully"
        );
        setShowToast(true);
        setTimeout(() => {
          router.navigate(`/project/${projectName}/styles`);
        }, 2000);
      } else {
        setToastMessage(result.error || "Upload failed.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("An error occurred while adding the CSS file.");
      setShowToast(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.navigate(`/project/${projectName}/styles`);
  };

  return (
    <>
      <div className="container-fluid text-white">
        <div className="row pt-2">
          <Row className="px-3">
            <h3>
              {mode === "view"
                ? "View CSS"
                : mode === "edit"
                ? "Edit CSS"
                : "Add CSS"}
            </h3>
          </Row>
          <div className="col-12 px-3">
            <Form onSubmit={handleSubmit} data-bs-theme="dark">
              <div className="row" style={{ width: "95%" }}>
                <div className="col-5">
                  <Form.Group>
                    <Form.Label>Css Name</Form.Label>
                    <Form.Control
                      placeholder="eg. myStyles"
                      type="text"
                      name="css_name"
                      value={formData.css_name}
                      onChange={handleChange}
                      disabled={mode === "edit"}
                      className="mb-3 w-100"
                    />
                  </Form.Group>
                </div>
                <div className="col-5">
                  <Form.Group>
                    <Form.Label>File path</Form.Label>
                    <Form.Control
                      placeholder="relative to src/..."
                      type="text"
                      name="file_path"
                      value={formData.file_path}
                      onChange={handleChange}
                      className="mb-3 w-100"
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row" style={{ width: "95%" }}>
                <div className="col-5">
                  <Form.Group>
                    <Form.Label>File name</Form.Label>
                    <Form.Control
                      placeholder="cssFile"
                      type="text"
                      name="css_filename"
                      value={formData.css_filename}
                      onChange={handleChange}
                      className="mb-3 w-100"
                    />
                  </Form.Group>
                </div>
                <div className="col-5">
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      placeholder="Enter description"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mb-3 w-100"
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Label>Add your styles here</Form.Label>
              <div className="d-flex justify-content-start">
                <div
                  id="css-editor"
                  style={{ height: "280px", width: "75%" }}
                ></div>
              </div>
              <div className="d-flex justify-content-start">
                {mode !== "view" && (
                  <Button variant="success" type="submit" className="my-2">
                    {mode === "edit" ? "Update" : "Save"}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  type="button"
                  className="my-2 ms-3"
                  onClick={handleCancel}
                >
                  {mode === "view" ? "Back" : "Cancel"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{toastMessage}</strong>
        </Toast.Header>
      </Toast>
    </>
  );
}

export default CssEditor;
