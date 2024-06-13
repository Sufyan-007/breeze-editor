// components/TreeComponent.js
import React from "react";
// import { buildTree } from "../utils/buildTree";
import "./TreeComponent.css";

const TreeNode = ({ node }) => {
  // Check if node is null or undefined
  if (!node) {
    return null; // Return null or handle the case appropriately
  }

  return (
    <li>
      {node.name}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};


const TreeComponent = ({ data }) => {
  // Function to build the nested tree structure from flat data
const buildTree = (data) => {
  // Check if data is empty or undefined
  if (!data || Object.keys(data).length === 0) {
    console.error("Data is empty or undefined.");
    return null;
  }

  const buildNode = (parentId) => {
    // Filter children based on parentId
    const children = Object.values(data).filter(
      (item) =>
        item.lineage && item.lineage[item.lineage.length - 1] === parentId
    );

    // Recursively build child nodes
    return children.map((child) => ({
      ...child,
      children: buildNode(child.id),
    }));
  };

  // Find the root node
  const root = Object.values(data).find(
    (item) => item.lineage && item.lineage.length === 0
  );

  // If root is not found, return null
  if (!root) {
    console.error("Root node not found in data.");
    return null;
  }

  // Build the tree
  return {
    ...root,
    children: buildNode(root.id),
  };
};


  const tree = buildTree(data);

  return (
    <div className="tree-view" style={{"color":"white"}}>
      <ul>
        <TreeNode node={tree} />
      </ul>
    </div>
  );
};

export default TreeComponent;