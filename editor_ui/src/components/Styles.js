import { React, useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import CssFileCard from "./CssFileCard";
import CssFileModal from "./CssFileModal";

function Styles() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    getAllCSSFiles();
  }, []);

  const getAllCSSFiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/editor/all-css-files/"
      );
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleView = async (css_name) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/get-css-file/${css_name}/`
      );
      const data = await response.json();
      setModalMode("view");
      setInitialData(data);
      setShowModal(true);
    } catch (error) {
      setToastMessage("An error occurred while trying to fetch the file.");
      setShowToast(true);
    }
  };

  const handleDelete = async (css_name) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/delete-css-file/${css_name}/`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setToastMessage("File deleted successfully!");
        setShowToast(true);
        getAllCSSFiles();
      } else {
        setToastMessage(result.error || "Failed to update the file.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("An error occurred while deleting the file.");
      setShowToast(true);
    }
  };
  const handleEdit = async (css_name) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/get-css-file/${css_name}/`
      );
      const data = await response.json();
      setModalMode("edit");
      setInitialData(data);
      setShowModal(true);
    } catch (error) {
      setToastMessage("An error occurred while trying to edit the file.");
      setShowToast(true);
    }
  };

  const onSubmit = async (payload, mode) => {
    // const obj = Object.fromEntries(payload.entries());
    const url =
      mode === "add"
        ? `http://localhost:8000/editor/add-css-file/`
        : `http://localhost:8000/editor/update-css-file/`;
    const method = mode === "add" ? "POST" : "PUT";
    try {
      const response = await fetch(url, {
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
      } else {
        setToastMessage(result.error || "Upload failed.");
      }
      setShowToast(true);
      setShowModal(false);
      getAllCSSFiles();
    } catch (error) {
      setToastMessage("An error occurred while adding the CSS file.");
      setShowToast(true);
    }
  };

  const handleDownload = (css_name) => {
    const downloadUrl = `http://localhost:8000/editor/css-file-download/${css_name}/`;
    window.location.href = downloadUrl;
  };

  const handleAdd = () => {
    setModalMode("add");
    setInitialData({});
    setShowModal(true);
  };

  return (
    <>
      <div className="container-fluid text-white px-4">
        <div className="col-12 my-3">
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={handleAdd}>
              + Add CSS
            </button>
          </div>
        </div>
        {files?.map((file, index) => (
          <div key={index} className="col-12">
            <CssFileCard
              fileName={file.css_file}
              onEdit={() => handleEdit(file.css_file)}
              onDelete={() => handleDelete(file.css_file)}
              onView={() => handleView(file.css_file)}
              onDownload={() => handleDownload(file.css_file)}
            />
          </div>
        ))}
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
      <CssFileModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        mode={modalMode}
        initialData={initialData}
        onSubmit={onSubmit}
      />
    </>
  );
}

export default Styles;
