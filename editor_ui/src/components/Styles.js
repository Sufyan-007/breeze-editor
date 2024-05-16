import { React, useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import CssFileCard from "./CssFileCard";
import CssFileUploadModal from "./CssFileUploadModal";
import {useParams} from "react-router-dom";
import { router } from "../App";

function Styles() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const {projectName} = useParams();


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

  const handleDownload = (css_name) => {
    const downloadUrl = `http://localhost:8000/editor/css-file-download/${css_name}/`;
    window.location.href = downloadUrl;
  };

  const handleAdd = () => {
    router.navigate(`/project/${projectName}/styles/add`);
  };

  const handleView = (css_name) => {
    router.navigate(`/project/${projectName}/styles/view/${css_name}`);
  };

  const handleEdit = (css_name) => {
    router.navigate(`/project/${projectName}/styles/edit/${css_name}`);
  };


  const handleUpload = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/editor/upload-css-file/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setToastMessage("CSS file uploaded successfully");
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

  return (
    <>
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4">
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary mx-2" onClick={() => {setShowModal(true)}}>
              Upload CSS
            </button>
            <button className="btn btn-secondary" onClick={handleAdd}>
              Add CSS
            </button>
          </div>
        </div>
        {files?.map((file, index) => (
          <div key={index} className="col-12 px-3">
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
      <CssFileUploadModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        onSubmit={handleUpload}
      />
    </>
  );
}

export default Styles;
