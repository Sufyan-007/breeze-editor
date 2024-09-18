import React, { useState, useEffect } from "react";
import "../../css/folder.css";
import pencilIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import crossIcon from "../../assets/icons/close-button.svg";
import tickIcon from "../../assets/icons/tick.svg";
import uploadIcon from "../../assets/icons/upload.svg";
import addFolder from "../../assets/icons/addFolder.svg";
import addFile from "../../assets/icons/addFile.svg";

const Node = ({
  node,
  style,
  dragHandle,
  onCreate,
  onRename,
  // onDelete,
  onUpload,
  onSelectPath,
  resourceUpload,
  selectedNode,
  setSelectedNode,
  onAdd
  
}) => {
  const nodeName =
    typeof node.data.name === "string"
      ? node.data.name
      : JSON.stringify(node.data.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(nodeName);
  const [expanded, setIsExpanded] = useState("");


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

  const handleAdd = (e,type) => {
    e.stopPropagation()
    onAdd(node.id,node, type)
  }

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

  const constructFolderPath = (node) => {
    let path = [];
    let currentNode = node;
    while (currentNode) {
      path.unshift(currentNode.data.name);
      currentNode = currentNode.parent;
    }
    return path.join("/");
  };

  const handleUploadClick = () => {
    const folderPath = constructFolderPath(node);
    onUpload(folderPath)
    
  };

  const handlePath = () => {
    if (node.data.type === "DIRECTORY") {
      setSelectedNode(node); // Set node as selected
      onSelectPath(node); // Pass selected node to FolderStruArborist
    }
  };

  const handleToggle = () => {
    node.toggle();
    setIsExpanded(!expanded);
  };

  // const handleDeleteClick = (e) => {
  //   e.stopPropagation();
  //   onDelete(node.id, node);
  // };

  
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
                   
                    handleAdd(e, "DIRECTORY");
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
                        
                        handleAdd(e,"FILE");
                      }}
                    >
                      <img
                        src={addFile}
                        alt="Add Folder"
                        width="15"
                        height="20"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadClick();
                      }}
                      className="icon-button"
                    >
                      <img
                        src={uploadIcon}
                        alt="Upload"
                        width="15"
                        height="20"
                      />
                    </button>
                  </>
                )}
                {/* <button
                  type="button"
                  className="icon-button"
                  onClick={(e) => {
                    handleDeleteClick(e);
                  }}
                >
                  <img src={deleteIcon} alt="Delete" width="15" height="20" />
                </button> */}
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
                    {/* <button
                      type="button"
                      className="icon-button"
                      onClick ={(e)=>{
                        handleDeleteClick(e)
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        width="15"
                        height="20"
                      />
                    </button> */}
                  </>
                )}
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Node;
