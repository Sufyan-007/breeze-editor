import React, { useState } from "react";
import TreeNode from "./TreeNode";

const FunctionTree = ({ initialBodyConfig, onEditNode, onAddChild }) => {
  const [bodyConfig, setBodyConfig] = useState(initialBodyConfig);
  const addNode = (parentId, nodeName) => {
    const newTree = addNodeRecursively(bodyConfig, parentId, nodeName);
    setBodyConfig(newTree);
  };

  const editNode = (nodeId, newName) => {
    const newTree = editNodeRecursively(bodyConfig, nodeId, newName);
    setBodyConfig(newTree);
  };

  const deleteNode = (nodeId) => {
    const deleteNodeRecursively = (node) => {
      if (node.children) {
        node.children = node.children
          .map(deleteNodeRecursively)
          .filter((child) => child.id !== nodeId);
      }
      return node;
    };

    setBodyConfig((prev) => {
      if (prev.id === nodeId) return null;
      return deleteNodeRecursively({ ...prev });
    });
  };

  return (
    <div className="tree">
      {bodyConfig ? (
        <TreeNode
          node={bodyConfig}
          addNode={addNode}
          editNode={editNode}
          deleteNode={deleteNode}
          onEditNode={onEditNode}
          onAddChild={onAddChild}
        />
      ) : (
        <div>No nodes</div>
      )}
    </div>
  );
};

function addNodeRecursively(node, parentId, nodeName) {
  if (node.id === parentId) {
    const newNode = { id: Date.now(), name: nodeName, children: [] };
    return { ...node, children: [...(node.children || []), newNode] };
  } else if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        addNodeRecursively(child, parentId, nodeName)
      ),
    };
  } else {
    return node;
  }
}

function editNodeRecursively(node, nodeId, newName) {
  if (node.id === nodeId) {
    return { ...node, name: newName };
  } else if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        editNodeRecursively(child, nodeId, newName)
      ),
    };
  } else {
    return node;
  }
}

export default FunctionTree;
