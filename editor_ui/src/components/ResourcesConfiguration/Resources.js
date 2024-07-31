import React, { useState, useEffect } from "react";
import { Modal, Table, Toast } from "react-bootstrap";
import ResourcesUploadModal from "./ResourcesUploadModal.js";
import { useParams } from "react-router";
import {
  getAllUploadedFiles,
  uploadFile,
  deleteFile,
  donwloadFile,
} from "../../services/ResourceUploadService.js";
import FolderStructureConfig from "../FolderStructureSection/FolderStructureConfig.js";
import ResourcesFileRow from "./ResourcesFileRow.js";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal.js";

const Resources = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false); // State for ResourcesUploadModal
  const [files, setFiles] = useState([]);
  const [selectedPath, setSelectedPath] = useState(""); // State to store selected path
  const [fileToDelete, setFileToDelete] = useState(null); // State to store selected path
  const { projectName } = useParams();
  const resourceUpload = true;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const files = await getAllUploadedFiles(projectName);
      setFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleUpload = async (formData) => {
    try {
      const result = await uploadFile(formData, projectName);
      if (result.message) {
        setToastMessage("File uploaded successfully");
      } else {
        setToastMessage(result.error || "Upload failed.");
      }
      setShowToast(true);
      setShowUploadModal(false); // Close ResourcesUploadModal after upload
      fetchFiles();
    } catch (error) {
      setToastMessage("An error occurred while adding the File.");
      setShowToast(true);
    }
  };
  const handleDelete = async () => {
    try {
      if (!fileToDelete) return;

      const deleteResult = await deleteFile(fileToDelete, projectName);
      if (deleteResult.message) {
        setToastMessage(deleteResult.message);
        setShowToast(true);
        fetchFiles();
      }
    } catch (error) {
      setToastMessage(
        error.message || "An error occurred while deleting the file."
      );
      setShowToast(true);
    } finally {
      setFileToDelete(null);
    }
  };
  const handleDownload = async (file) => {
    try {
      const result = await donwloadFile(file, projectName);
      if (result) {
        setToastMessage("File downloaded successfully");
        setShowToast(true);
        fetchFiles();
      }
    } catch (error) {
      setToastMessage(
        error.message || "An error occurred while downloading the file."
      );
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4 d-flex justify-content-between">
          <div className="">
            <h3>Resources</h3>
          </div>
          <div className="d-flex">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Add Resource
            </button>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Path</th>
              <th style={{ width: "5%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <ResourcesFileRow
                key={index}
                file={file}
                onDelete={() => setFileToDelete(file)}
                onDownload={() => handleDownload(file)}
              />
            ))}
            {files.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-white"
                  style={{ fontStyle: "italic" }}
                >
                  ---- No resources found ----
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        className="text-white"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        size="lg"
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select file location</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          <FolderStructureConfig
            onHide={() => {
              setShowModal(false);
              setShowUploadModal(true); // Show ResourcesUploadModal after selecting path
            }}
            onSelectPath={(path) => {
              setSelectedPath(path); // Store selected path
            }}
            resourceUpload={resourceUpload}
          />
        </Modal.Body>
      </Modal>
      <ResourcesUploadModal
        show={showUploadModal}
        onHide={() => {
          setShowUploadModal(false);
        }}
        path={selectedPath} // Pass selected path to ResourcesUploadModal
        onSubmit={handleUpload} // Optionally handle form submission within ResourcesUploadModal
      />
      <DeleteConfirmationModal
        fileName={fileToDelete ? fileToDelete.name : null}
        show={!!fileToDelete}
        onHide={() => setFileToDelete(null)}
        onDelete={handleDelete}
      />{" "}
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
};

export default Resources;
