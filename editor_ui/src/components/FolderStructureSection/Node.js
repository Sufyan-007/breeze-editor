import React, { useState, useEffect } from "react";
import "../../css/folder.css";
import pencilIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import crossIcon from "../../assets/icons/close-button.svg";
import tickIcon from "../../assets/icons/tick.svg";
import uploadIcon from "../../assets/icons/upload.svg";
const Node = ({ node, style, dragHandle, onCreate, onRename, onDelete, onSelectPath, resourceUpload }) => {
  const nodeName = typeof node.data.name === "string" ? node.data.name : JSON.stringify(node.data.name);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.data.name);
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");
  const [isSelected, setIsSelected] = useState(false); // State to track if node is selected
  useEffect(()=>{
    if(!isSelected) {
      // onSelectPath({})

    }
    
    console.log(isSelected)
  },[isSelected])

  const handleHover = (hoverState) => setIsHovered(hoverState);

  const getIcon = (type) => {
    switch (type) {
      case "DIRECTORY":
        return <span style={{ fontSize: "12px" }}>📁</span>;
      case "FILE":
        return <span style={{ fontSize: "12px" }}>📄</span>;
      default:
        return <span style={{ fontSize: "12px" }}>📃</span>;
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

  const handleUpload = () => {
    console.log("upload file");
  }
// console.log(typeof node.data.name, "node.data.name");

  const handlePath = () => {
    if (node.data.type === "DIRECTORY") {
      setIsSelected(true); // Set node as selected
      onSelectPath(node); // Pass selected node to FolderStruArborist
    }
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
        <div className={`${isSelected ? "selected-node" : ""}`} style={{ display: "inline-block" }}>
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation to parent div
              handlePath(); // Handle path selection
            }}
          >
            {getIcon(node.data.type)} {nodeName}
          </span>
        </div>
        )}
        {isHovered && !isEditing && (
          <span className="add-icons">
            {node.data.type === "DIRECTORY" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFolder();
                  }}
                >
                  📁+
                </button>
                {!resourceUpload ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFile();
                    }}
                  >
                    📄+
                  </button>
                ):null
                }
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}
              className="icon-button"
            >
              <img src={pencilIcon} alt="Edit" width="15" height="20" />
            </button>
            <button
              onClick=
              {(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              className="icon-button" >
              <img src={uploadIcon} alt="Upload" width="15" height="20" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="icon-button"
            >
              <img src={deleteIcon} alt="Delete" width="15" height="20" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default Node;
