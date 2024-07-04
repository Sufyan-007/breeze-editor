import React, { useState } from "react";

const TreeNodeEditor = ({ node, onSave, onCancel }) => {
  const [newName, setNewName] = useState(node.name);

  const handleSave = () => {
    onSave(node.id, newName); // Trigger onSave callback with node id and new name
  };

  console.log('node::>>', node);

  return (
    <div>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
       <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default TreeNodeEditor;
