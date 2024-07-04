import React, { useState } from "react";

const AddTreeNode = ({ parentNode, onSave, onCancel }) => {
  const [childName, setChildName] = useState("");

  const handleSave = () => {
    onSave(parentNode.id, childName); // Trigger onSave callback with parent node id and new child name
    setChildName("");
  };

  return (
    <div>
      <input
        type="text"
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        placeholder="New child name"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default AddTreeNode;
