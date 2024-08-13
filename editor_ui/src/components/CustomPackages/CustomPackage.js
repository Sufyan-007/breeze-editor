import React, { useState } from "react";
import { Table } from "react-bootstrap";
import ResourcesUploadModal from "../ResourcesConfiguration/ResourcesUploadModal";

function CustomPackage() {
  const [showToast, setShowToast] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleUpload = async(formData) => {
     try {
      const file = formData.file; //get the uploaded file from form Data

      //convert file to blob 
      const fileBlob = new Blob([file], {type:file.type});

      

      setShowToast(true);
      setShowUploadModal(false); // Close ResourcesUploadModal after upload
      // fetchFiles();
    } catch (error) {
      setToastMessage("An error occurred while adding the File.");
      setShowToast(true);
    }
  };
  
  const handleModal = () => {
    setShowUploadModal(true);
   
  }
  return (
    <div>
      <div className="container-fluid text-white">
        <div className="col-12 my-3 px-4 d-flex justify-content-between">
          <h3>Custom Packages</h3>
          <div className="d-flex">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => 
                handleModal()} 
            >
              Upload Zip
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
        </Table>
      </div>
      {/* <ResourcesUploadModal
        show={showUploadModal} 
        onHide={() => setShowUploadModal(false)} 
        path={selectedPath} 
        onSubmit={handleUpload} 
        acceptedFileTypes={['zip']}
      /> */}
    </div>
  );
}

export default CustomPackage;
