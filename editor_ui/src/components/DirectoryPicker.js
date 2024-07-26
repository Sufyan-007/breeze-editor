import React, { useState } from "react";
import { Modal, Button, ListGroup, Form, InputGroup } from "react-bootstrap";

const mockDirectoryStructure = {
  generated_projects: {
    folder1: {
      subfolder1: {},
      subfolder2: {},
    },
    folder2: {
      subfolder1: {},
    },
  },
};

const DirectoryPicker = ({ form }) => {
  const [show, setShow] = useState(false);
  const [currentPath, setCurrentPath] = useState(["generated_projects"]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const navigateTo = (folder) => {
    setCurrentPath((prevPath) => [...prevPath, folder]);
    setSelectedFolder("");
  };

  const navigateBack = () => {
    setCurrentPath((prevPath) => prevPath.slice(0, -1));
    setSelectedFolder("");
  };

  const handleSelect = () => {
    const fullPath = selectedFolder
      ? [...currentPath, selectedFolder].join("/")
      : currentPath.join("/");
    form.setValue("projectPath", fullPath);
    console.log(form.getValues());
    handleClose();
  };

  const getCurrentDirectory = () => {
    return currentPath.reduce(
      (acc, folder) => acc[folder],
      mockDirectoryStructure
    );
  };

  const currentDirectory = getCurrentDirectory();

  const handleFolderClick = (folder) => {
    setSelectedFolder((prevSelectedFolder) =>
      prevSelectedFolder === folder ? "" : folder
    );
  };

  const handleFolderDoubleClick = (folder) => {
    navigateTo(folder);
  };

  const handleAddFolder = () => {
    if (newFolderName) {
      currentDirectory[newFolderName] = {};
      setNewFolderName("");
    }
  };

  const currentFullPath = selectedFolder
    ? `${currentPath.join("/")}/${selectedFolder}`
    : currentPath.join("/");

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-primary bg-white"
        style={{ color: "#152733" }}
      >
        Choose Directory
      </Button>

      <div className="text-white mt-2">
        Selected Directory: {currentFullPath}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        data-bs-theme="dark"
        size="lg"
        className="text-white"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Directory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {Object.keys(currentDirectory).map((folder) => (
              <ListGroup.Item
                key={folder}
                action
                active={folder === selectedFolder}
                onClick={() => handleFolderClick(folder)}
                onDoubleClick={() => handleFolderDoubleClick(folder)}
                style={{
                  backgroundColor:
                    folder === selectedFolder ? "#6c757d" : "inherit",
                  borderColor: "#6c757d",
                }}
              >
                {folder}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <InputGroup className="mt-3">
            <Form.Control
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleAddFolder}
              style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
            >
              Add Folder
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          {currentPath.length > 1 && (
            <Button
              variant="secondary"
              onClick={navigateBack}
              className="mb-2"
              style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
            >
              Back
            </Button>
          )}
          <div className="text-white flex-grow-1 text-center">
            {currentFullPath}
          </div>
          <Button
            variant="primary"
            onClick={handleSelect}
            className="ml-auto"
            style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
          >
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DirectoryPicker;
