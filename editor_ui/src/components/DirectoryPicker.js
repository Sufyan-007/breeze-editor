import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Form, InputGroup } from "react-bootstrap";

const DirectoryPicker = ({ form }) => {
  const [show, setShow] = useState(false);
  const [currentPath, setCurrentPath] = useState("generated_projects");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [directoryStructure, setDirectoryStructure] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/all-projects/`)
      .then((response) => response.json())
      .then((data) => {
        const structure = buildFileStructure(data);
        setDirectoryStructure(structure);
      })
      .catch((error) => {
        console.error("Error fetching directory structure:", error);
      });
  }, []);

  const buildFileStructure = (projects) => {
    const fileStructure = {};

    Object.keys(projects).forEach((projectKey) => {
      const project = projects[projectKey];
      const pathParts = project.projectPath.split("/");

      let currentLevel = fileStructure;

      pathParts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = { folders: {}, files: [] };
        }
        if (index < pathParts.length - 1) {
          currentLevel = currentLevel[part].folders;
        }
      });

      currentLevel[pathParts[pathParts.length - 1]].files.push(project.projectName);
    });
    return fileStructure;
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const navigateTo = (folder) => {
    setCurrentPath((prevPath) => `${prevPath}/${folder}`);
    setSelectedFolder("");
  };

  const navigateBack = () => {
    setCurrentPath((prevPath) => {
      const pathArray = prevPath.split("/");
      pathArray.pop();
      return pathArray.join("/");
    });
    setSelectedFolder("");
  };

  const handleSelect = () => {
    form.setValue("projectPath", currentFullPath);
    handleClose();
  };

  const getCurrentDirectory = (structure, path) => {
    const pathParts = path.split("/");
    let currentLevel = structure;
    let result = {};

    for (const part of pathParts) {
      if (currentLevel[part]) {
        result[part] = currentLevel[part];
        currentLevel = currentLevel[part].folders;
      } else {
        console.log("object");
      }
    }

    return result[pathParts[pathParts.length - 1]];
  };

  const currentDirectory = getCurrentDirectory(directoryStructure, currentPath);

  const handleFolderClick = (folder) => {
    setSelectedFolder((prevSelectedFolder) =>
      prevSelectedFolder === folder ? "" : folder
    );
  };
  const handleFolderDoubleClick = (name) => {
    const folder = currentDirectory.folders
      ? currentDirectory.folders[name]
      : null;

    if (folder) {
      navigateTo(name);
    }
  };

  const handleAddFolder = (currentDirectory, path, newFolderName) => {
    if (Object.keys(currentDirectory.folders).includes(newFolderName)) {
      console.log("already");
    } else {
      currentDirectory.folders[newFolderName] = { folders: {}, files: [] };
      setNewFolderName("");
    }
  };

  const currentFullPath = selectedFolder
    ? `${currentPath}/${selectedFolder}`
    : currentPath;

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
            {currentDirectory && (
              <>
                {Object.entries(currentDirectory.folders || {}).map(
                  ([folderName, folderContent]) => (
                    <React.Fragment key={folderName}>
                      <ListGroup.Item
                        action
                        active={folderName === selectedFolder}
                        onClick={() => handleFolderClick(folderName)}
                        onDoubleClick={() =>
                          handleFolderDoubleClick(folderName)
                        }
                        style={{
                          backgroundColor:
                            folderName === selectedFolder
                              ? "#6c757d"
                              : "inherit",
                          borderColor: "#6c757d",
                        }}
                      >
                        {folderContent.isProject
                          ? folderContent.projectName
                          : folderName}
                      </ListGroup.Item>
                    </React.Fragment>
                  )
                )}
                {currentDirectory.files &&
                  currentDirectory.files.map((file) => (
                    <ListGroup.Item
                      key={file}
                      action
                      disabled
                      style={{
                        backgroundColor:
                          file === selectedFolder ? "#6c757d" : "inherit",
                        borderColor: "#6c757d",
                      }}
                    >
                      {file}
                    </ListGroup.Item>
                  ))}
              </>
            )}
          </ListGroup>
          <InputGroup className="mt-3">
            <Form.Control
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() =>
                handleAddFolder(
                  currentDirectory,
                  currentFullPath,
                  newFolderName
                )
              }
              style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
            >
              Add Folder
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          {currentPath.length > 0 && (
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
