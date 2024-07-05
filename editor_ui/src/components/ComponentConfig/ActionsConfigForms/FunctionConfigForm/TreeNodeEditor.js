import React, { useState } from "react";

const TreeNodeEditor = ({ node, onSave, onCancel }) => {
  const [newName, setNewName] = useState(node.name);

  const handleSave = () => {
    onSave(node.id, newName);
  };


  return (
    <div className="d-flex flex-column h-100">
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="form-control form-control-sm mb-3"
      />

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          Update
        </button>
      </div>
    </div>
  );
};

export default TreeNodeEditor;
