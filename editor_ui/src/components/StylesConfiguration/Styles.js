import { React, useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import CssFileCard from "./CssFileCard";
import CssFileUploadModal from "./CssFileUploadModal";
import { useParams } from "react-router-dom";
import { router } from "../../App";

function Styles() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const { projectName } = useParams();

  useEffect(() => {
    getAllCSSFiles();
  }, []);

  const getAllCSSFiles = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/project-styles/?projectId=${projectName}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFiles(Object.keys(data));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleAdd = () => {
    router.navigate(`/project/${projectName}/styles/add`);
  };

  const handleUpload = async (formData) => {
    try {
      formData.projectId = projectName;
      const submitData = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== "css_file") {
          submitData.append(key, formData[key]);
        }
      }

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        submitData.append("css_file", file);
      }
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/project-styles/`,
        {
          method: "POST",
          body: submitData,
        }
      );
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

  const handleView = (css_name) => {
    router.navigate(`/project/${projectName}/styles/view/${css_name}`);
  };

  const handleEdit = (css_name) => {
    router.navigate(`/project/${projectName}/styles/edit/${css_name}`);
  };

  const handleDelete = async (css_name) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/project-styles/?projectId=${projectName}&css_name=${css_name}`,
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

  return (
    <>
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4 d-flex justify-content-between">
          <div className="">
            <h3>Project Styles</h3>
          </div>
          <div className="d-flex">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => {
                setShowModal(true);
              }}
            >
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
              fileName={file}
              onEdit={() => handleEdit(file)}
              onDelete={() => handleDelete(file)}
              onView={() => handleView(file)}
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
          <strong className="me-auto">{toastMessage}</strong>
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
