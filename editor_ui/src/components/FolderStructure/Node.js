import React, { useState, useEffect } from "react";
import "../../css/folder.css";

const Node = ({ node, style, dragHandle, onCreate, onRename, onDelete }) => {
 
  const[showIcons , setShowIcons] = useState(false);
  const getIcon = (type) => {
    switch (type) {
      case "DIRECTORY":
        return <span style={{ fontSize: "12px" }}>📁</span>; // Folder icon
      case "FILE":
        return <span style={{ fontSize: "12px" }}>📄</span>; // File icon
      default:
        return <span style={{ fontSize: "12px" }}>📃</span>; // Default icon
    }
  };
  const handleAddFolder = () => {
    onCreate(node.id, "DIRECTORY", node.data.lineage, node.data.tag);
  };

  const handleAddFile = () => {
    onCreate(node.id, "FILE", node.data.lineage, node.data.tag);
  };

  const handleRename = () => {
    const newName = prompt("Enter new name:", node.data.name);
    if (newName) {
      onRename(node.id, newName);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${node.data.name}?`)) {
      onDelete(node.id);
    }
  };

   const toggleIcons = (e) => {
     e.stopPropagation();
     setShowIcons(!showIcons);
   };

  return (
    <div style={style} ref={dragHandle} onClick={() => node.toggle()}>
      <div onClick={toggleIcons} style={{ display: "inline-block" }}>
        <span onClick={() => node.toggle()}>
          {getIcon(node.data.type)} {node.data.name}
        </span>
      </div>
      {showIcons && (
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddFile();
                }}
              >
                📄+
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
            className="icon-button"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="icon-button"
          >
            🗑️
          </button>

          {/* <button className="close-icon" onClick={toggleIcons}>
            ×
          </button> */}
        </span>
      )}
    </div>
  );
};

export default Node ;