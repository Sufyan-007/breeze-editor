import { React, useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import CssFileCard from "./CssFileCard";
import CssFileModal from "./CssFileModal";

function Styles() {
  const [uploadedFile, setUploadedFile] = useState();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedFile) {
      setToastMessage("Please select a file to upload.");
      setShowToast(true);
      return;
    }

    const acceptedTypes = ["text/css"];

    if (uploadedFile && !acceptedTypes.includes(uploadedFile.type)) {
      setToastMessage("Unsupported file type. Please upload a CSS file.");
      setShowToast(true);
    } else {
      const formData = new FormData();
      formData.append("css_file", uploadedFile);

      try {
        const response = await fetch(
          "http://localhost:8000/editor/upload-css-file/",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (response.ok) {
          setToastMessage(result.message || "File uploaded successfully!");
        } else {
          setToastMessage(result.error || "Upload failed.");
        }
        setShowToast(true);
        getAllCSSFiles();
      } catch (error) {
        setToastMessage("An error occurred while uploading the file.");
        setShowToast(true);
      }
    }
  };

  useEffect(() => {
    getAllCSSFiles();
  }, []);

  const getAllCSSFiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/editor/all-css-files"
      );
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleView = async (filename) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/get-css-file/${filename}`
      );
      const data = await response.json();
      setModalTitle(data.file_name);
      setModalContent(data.content);
      setIsEditable(false);
      setShowModal(true);
    } catch (error) {
      setToastMessage("An error occurred while trying to fetch the file.");
      setShowToast(true);
    }
  };
  const handleDelete = async (filename) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/delete-css-file/${filename}/`,
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
  const handleEdit = async (fileName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/editor/get-css-file/${fileName}`
      );
      const data = await response.json();
      setModalTitle(data.file_name);
      setModalContent(data.content);
      setIsEditable(true);
      setShowModal(true);
    } catch (error) {
      setToastMessage("An error occurred while trying to edit the file.");
      setShowToast(true);
    }
  };

  const handleSubmitEdit = async (content) => {
    const formData = new FormData();
    formData.append(
      "css_file",
      new Blob([content], { type: "text/css" }),
      modalTitle
    );

    try {
      const response = await fetch(
        `http://localhost:8000/editor/update-css-file/${modalTitle}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setToastMessage("File updated successfully!");
        setShowToast(true);
        setShowModal(false);
        getAllCSSFiles();
      } else {
        setToastMessage(result.error || "Failed to update the file.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("An error occurred while updating the file.");
      setShowToast(true);
    }
  };

  const handleDownload = (filename) => {
    const downloadUrl = `http://localhost:8000/editor/css-file-download/${filename}`;
    window.location.href = downloadUrl;
  };
  return (
    <>
      <div className="container-fluid text-white">
        <div className="col-md-6 col-12 mb-3">
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
              <input type="file" accept=".css" onChange={handleFileChange} />
              <button type="submit" className="btn btn-secondary btn-sm">
                Upload CSS
              </button>
            </div>
          </form>
        </div>
        {files.map((file, index) => (
          <div key={index} className="col-md-6 col-12">
            <CssFileCard
              fileName={file.file_name}
              onEdit={() => handleEdit(file.file_name)}
              onDelete={() => handleDelete(file.file_name)}
              onView={() => handleView(file.file_name)}
              onDownload={() => handleDownload(file.file_name)}
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
        title={modalTitle}
        content={modalContent}
        isEditable={isEditable}
        onSubmit={handleSubmitEdit}
      />
    </>
  );
}

export default Styles;
