import React, { useState } from "react";
import "../../css/folder.css";
import pencilIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import crossIcon from "../../assets/icons/close-button.svg";
import tickIcon from "../../assets/icons/tick.svg";
import uploadIcon from "../../assets/icons/upload.svg";
import addFolder from "../../assets/icons/addFolder.svg";
import addFile from "../../assets/icons/addFile.svg";
import ResourcesUploadModal from "../ResourcesConfiguration/ResourcesUploadModal";
import { uploadFile } from "../../services/ResourceUploadService.js";
import { fetchFolderConfig } from "../../services/DirectoryManagementService";
import { useParams } from "react-router";
const Node = ({
  node,
  style,
  dragHandle,
  onCreate,
  onRename,
  onDelete,
  onSelectPath,
  resourceUpload,
  selectedNode,
  setSelectedNode,
}) => {
  const nodeName =
    typeof node.data.name === "string"
      ? node.data.name
      : JSON.stringify(node.data.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(nodeName);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentFolderPath, setCurrentFolderPath] = useState("");
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");
  const [isSelected, setIsSelected] = useState(false); // State to track if node is selected
  const [toastMessage, setToastMessage] = useState("");
  const [expanded, setIsExpanded] = useState("");
  const { projectName } = useParams();

  const handleHover = (hoverState) => setIsHovered(hoverState);

  const getIcon = (type) => {
    switch (type) {
      case "DIRECTORY":
        return <span style={{ fontSize: "14px" }}>📁</span>;
      case "FILE":
        return <span style={{ fontSize: "14px" }}>📄</span>;
      default:
        return <span style={{ fontSize: "14px" }}>📃</span>;
    }
  };
  const handleAddFolder = () => {
    onCreate(node.id, "DIRECTORY", node.data.lineage, node.data.tag);
  };

  const handleAddFile = () => {
    onCreate(node.id, "FILE", node.data.lineage, node.data.tag);
  };

  const handleRename = () => {
    setIsEditing(true);
    // if (newName) {
    //   onRename(node.id, newName);
    // }
  };

  const handleSave = () => {
    onRename(node.id, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(nodeName);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${nodeName}?`)) {
      onDelete(node.id);
    }
  };

  const constructFolderPath = (node) => {
    let path = [];
    let currentNode = node;
    while (currentNode) {
      path.unshift(currentNode.data.name);
      currentNode = currentNode.parent;
    }
    return path.join("/").slice(1);
  };

  const handleUploadClick = () => {
    const folderPath = constructFolderPath(node);
    setCurrentFolderPath(folderPath);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handlePath = () => {
    if (node.data.type === "DIRECTORY") {
      setSelectedNode(node); // Set node as selected
      onSelectPath(node); // Pass selected node to FolderStruArborist
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
      setIsModalVisible(false);
      fetchFolderConfig(projectName);
    } catch (error) {
      setToastMessage("An error occurred while adding the File.");
      setShowToast(true);
    }
  };
  const handleToggle = () => {
    node.toggle();
    setIsExpanded(!expanded);
  };
  return (
    <div
      style={style}
      ref={dragHandle}
      // onClick={() => node.toggle()}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="node-content" style={{ display: "inline-block" }}>
        {isEditing ? (
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "150px", height: "25px" }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();

                handleSave();
              }}
              className="edit-button"
            >
              <img src={tickIcon} alt="Save" width="15" height="20" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="edit-button"
            >
              <img src={crossIcon} alt="Cancel" width="15" height="20" />
            </button>
          </div>
        ) : (
          <>
            {node.data.type === "DIRECTORY" ? (
              <>
                <span
                  type="button"
                  className="btn"
                  onClick={handleToggle}
                  style={{ paddingLeft: "0", paddingRight: "1px" }}
                >
                  {expanded ? (
                    <i className="bi bi-chevron-down"></i>
                  ) : (
                    <i className="bi bi-chevron-right"></i>
                  )}
                </span>
              </>
            ) : (
              <span style={{ paddingLeft: "19px" }}></span>
            )}
            <div
              className={`${
                selectedNode && selectedNode.id === node.id
                  ? "selected-node"
                  : ""
              }`}
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation(); // Prevent propagation to parent div
                  if (resourceUpload) {
                    handlePath();
                  }
                }}
                style={{ fontSize: "18px" }}
              >
                {getIcon(node.data.type)} {nodeName}
              </span>
            </div>
          </>
        )}
        {isHovered && !isEditing && (
          <span className="add-icons">
            {node.data.type === "DIRECTORY" ? (
              <>
                <button
                  type="button"
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFolder();
                  }}
                >
                  <img
                    src={addFolder}
                    alt="Add Folder"
                    width="15"
                    height="20"
                  />
                </button>
               
                <button
                  type="button"
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename();
                  }}
                >
                  <img src={pencilIcon} alt="Edit" width="15" height="20" />
                </button>

                {!resourceUpload && (
                  <>
                   <button
                  type="button"
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFile();
                  }}
                >
                  <img src={addFile} alt="Add Folder" width="15" height="20" />
                </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                    className="icon-button"
                  >
                    <img src={uploadIcon} alt="Upload" width="15" height="20" />
                  </button>
                  </>
                )}
                <button
                  type="button"
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <img src={deleteIcon} alt="Delete" width="15" height="20" />
                </button>
              </>
            ) : (
              <>
                {!resourceUpload && (
                  <>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename();
                      }}
                    >
                      <img src={pencilIcon} alt="Edit" width="15" height="20" />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        width="15"
                        height="20"
                      />
                    </button>
                  </>
                )}
              </>
            )}
          </span>
        )}
      </div>
      {isModalVisible && (
        <ResourcesUploadModal
          show={isModalVisible}
          onHide={handleCloseModal}
          onSubmit={handleUpload}
          path={currentFolderPath}
        />
      )}
    </div>
  );
};

export default Node;
