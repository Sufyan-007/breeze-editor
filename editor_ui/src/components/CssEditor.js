import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as monaco from "monaco-editor";
import { Button, Form, Toast } from "react-bootstrap";
import { router } from "../App";

function CssEditor({ mode }) {
  const { css_name, projectName } = useParams(); // Grabbing the CSS file name from the URL if present
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [cssName, setCssName] = useState("");
  const editorRef = useRef(null);

  const handleView = useCallback(() => {
    fetch(`http://localhost:8000/editor/get-css-file/${css_name}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setInitialData(data);
      })
      .catch((error) => {
        setToastMessage("An error occurred while trying to fetch the file.");
        setShowToast(true);
      });
  }, [css_name]);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      handleView();
    }
  }, [handleView, mode]);

  useEffect(() => {
    const editor = monaco.editor.create(document.getElementById("css-editor"), {
      value: initialData.content,
      language: "css",
      theme: "vs-dark",
    });
    editorRef.current = editor;

    return () => editor.dispose();
  }, [initialData.content]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && initialData) {
      setCssName(initialData.css_name);
      editorRef.current.setValue(initialData.content || "");
    } else {
      setCssName("");
      editorRef.current.setValue("");
    }
  }, [initialData, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("editorRef.current.value::>>", editorRef.current.getValue());
    const url =
      mode === "add"
        ? `http://localhost:8000/editor/add-css-content/`
        : `http://localhost:8000/editor/update-css-file/`;
    const method = mode === "add" ? "POST" : "PUT";
    const payload = JSON.stringify({
      css_name: cssName,
      css_content: editorRef.current.getValue(),
    });

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: method,
        body: payload,
      });
      const result = await response.json();
      if (response.ok) {
        setToastMessage(
          result.message || mode === "add"
            ? "CSS Added Successfully"
            : "CSS Updated Successfully"
        );
        router.navigate(`/project/${projectName}`);
      } else {
        setToastMessage(result.error || "Upload failed.");
      }
      setShowToast(true);
    } catch (error) {
      setToastMessage("An error occurred while adding the CSS file.");
      setShowToast(true);
    }
  };
  return (
    <>
      <div className="container-fluid text-white">
        <div class="row py-2">
          <h3>
            {mode === "view"
              ? "View CSS"
              : mode === "edit"
              ? "Edit CSS"
              : "Add CSS"}
          </h3>
          <div className="col-12 px-3">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  placeholder="Enter CSS Name"
                  type="text"
                  value={cssName}
                  onChange={(e) => setCssName(e.target.value)}
                  disabled={mode === "edit"}
                  className="mb-3 w-50"
                />
              </Form.Group>
              <Form.Label>Add your styles here</Form.Label>
              <div className="d-flex justify-content-start">
                <div
                  id="css-editor"
                  style={{ height: "350px", width: "85%" }}
                ></div>
              </div>
              <div className="d-flex justify-content-start">
                {mode !== "view" && (
                  <Button variant="primary" type="submit" className="my-2">
                    {mode === "edit" ? "Update" : "Save"}
                  </Button>
                )}
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
          <strong className="me-auto text-success">{toastMessage}</strong>
        </Toast.Header>
      </Toast>
    </>
  );
}

export default CssEditor;
