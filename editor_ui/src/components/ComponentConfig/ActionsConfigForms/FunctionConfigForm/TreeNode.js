import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

const TreeNode = ({
  node,
  addNode,
  editNode,
  deleteNode,
  onEditNode,
  onAddChild,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [childName, setChildName] = useState("");

  const handleEditNode = () => {
    setIsEditing(true);
    onEditNode(node.id);
  };

  const handleAddChild = () => {
    setChildName("");
    onAddChild(node.id);
  };

  const handleAddNode = () => {
    if (childName.trim()) {
      addNode(node.id, childName);
      setChildName("");
    }
  };

  const handleEditNodeSave = () => {
    if (newName.trim()) {
      editNode(node.id, newName);
      setIsEditing(false);
    }
  };

  return (
    <div className="tree-node">
      <div className="d-flex align-items-center">
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleEditNodeSave}
          />
        ) : (
          <span>{node.name}</span>
        )}

        <Dropdown className="ms-3">
          <Dropdown.Toggle as="i" className="bi bi-three-dots-vertical"></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleEditNode}>
              <i className="bi bi-pencil-square"></i> Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => deleteNode(node.id)}>
              <i className="bi bi-trash-fill"></i> Delete
            </Dropdown.Item>
            <Dropdown.Item onClick={handleAddChild}>
              <i className="bi bi-plus-square"></i> Add Child
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {childName && (
        <div className="add-child mt-2">
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="New child name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddNode();
            }}
            onBlur={handleAddNode}
          />
        </div>
      )}

      {node.children && (
        <ul>
          {node.children.map((child) => (
            <li key={child.id}>
              <TreeNode
                node={child}
                addNode={addNode}
                editNode={editNode}
                deleteNode={deleteNode}
                onEditNode={onEditNode}
                onAddChild={onAddChild}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeNode;
