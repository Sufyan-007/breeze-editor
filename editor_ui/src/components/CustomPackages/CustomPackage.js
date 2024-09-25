import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Table,Toast } from "react-bootstrap";
import CustomPackageModel from "./CustomPackageModel";
import {
  uploadZipFile,
  fetchZipFiles,
  deleteFile
} from "../../services/CustomPackageService";
import deleteicon from "../../assets/icons/delete-trash.svg";
import { get, set } from "react-hook-form";
import ConfirmationModal from "../common/ConfirmationModal";

function CustomPackage() {
  const [showToast, setShowToast] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const[ showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [zipFiles, setZipFiles] = useState({});
  const [fileToDelete, setFileToDelete] = useState(null);
  const { projectName } = useParams();

  useEffect(() => {
    getZipFiles();
  }, []);

  const getZipFiles = async () => {
    try {
      const result = await fetchZipFiles(projectName);
      // console.log(result, "result");
      if (result && result.folders) {
        setZipFiles(result.folders);
      }
    } catch (error) {
      console.error("Error fetching zip files:", error);
    }
  };

  // console.log(zipFiles, "zip files ");
  const handleUpload = async (formData) => {
    // Remove the .zip extension from the formData.filename
    const uploadedFileNameWithoutExtension = formData.filename.replace(
      /\.zip$/i,
      ""
    );

    console.log(formData, "form data");
    const existingFileNames = zipFiles.map((file) => file.name);
    console.log(existingFileNames, "existing file names ");
    if (existingFileNames.includes(uploadedFileNameWithoutExtension)) {
      setToastMessage("A file with the same name already exists.");
      setShowToast(true);
      return;
    }

    try {
      const result = await uploadZipFile(formData, projectName);
      console.log(result, "result");
      if (result.message) {
        setToastMessage("File uploaded successfully");
        getZipFiles();
      } else {
        setToastMessage(result.error || "Upload failed.");
      }
      setShowUploadModal(false);
    } catch (error) {
      setToastMessage("An error occurred while adding the file.");
      setShowToast(true);
    }
  };

  const handleModal = () => {
    setShowUploadModal(true);
  };

  const handleDelete = async () => {
    try {
      if (!fileToDelete) return;

      const deleteResult = await deleteFile(fileToDelete, projectName);
      if (deleteResult.message) {
        setToastMessage(deleteResult.message);
        setShowToast(true);
        getZipFiles();
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
 
console.log(zipFiles,"zip files")
  return (
    <div>
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4 d-flex justify-content-between">
          <h3>Custom Packages</h3>
          <div className="d-flex">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => handleModal()}
            >
              Upload Zip
            </button>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Last Modified</th>
              <th style={{ width: "5%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zipFiles.length > 0 ? (
              zipFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{file.lastModified}</td>
                  <td style={{ textAlign: "center.33.0" }}>
                    <img
                      src={deleteicon}
                      height="30px"
                      width="30px"
                      alt="Delete icon"
                      onClick={() => {
                        setFileToDelete(file.name);
                        setShowDeleteModal(true);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No zip files found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <CustomPackageModel
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onSubmit={handleUpload}
      />
      <ConfirmationModal
        show={!!fileToDelete}
        onHide={() => setFileToDelete(null)}
        onCancel={() => setFileToDelete(null)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={
          fileToDelete
            ? `Are you sure you want to delete ${fileToDelete}?`
            : "No file selected."
        }
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
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
    </div>
  );
}

export default CustomPackage;
