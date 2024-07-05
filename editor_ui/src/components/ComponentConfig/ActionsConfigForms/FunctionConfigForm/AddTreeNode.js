import React, { useState } from "react";

const AddTreeNode = ({ parentNode, onSave, onCancel }) => {
  const [childName, setChildName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const options = [
    { value: "1", label: "Create Variable" },
    { value: "2", label: "Function Call" },
    { value: "3", label: "Custom Code" },
    { value: "4", label: "Conditional Block" },
  ];

  const handleSave = () => {
    onSave(parentNode.id, childName); // Trigger onSave callback with parent node id and new child name
    setChildName("");
  };

  const renderAdditionalFields = () => {
    switch (selectedOption) {
      case "1":
        return (
          <div>
            {/* Render Create Variable form */}
            <div className="mb-2">
              <strong> Create a new Variable</strong>
            </div>
            <div className="row align-items-center">
              <div className="col-4">
                <label htmlFor="declaration_type" className="col-form-label">
                  Declaration Type
                </label>
              </div>
              <div className="col-6">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option>Select</option>
                  <option value="const">Const</option>
                  <option value="var">Var</option>
                  <option value="let">Let</option>
                </select>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-4">
                <label htmlFor="var_name" className="col-form-label">
                  Variable Name
                </label>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  placeholder="Variable Name"
                  className="form-control form-control-sm"
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-4">
                <label htmlFor="var_value" className="col-form-label">
                  Value
                </label>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  placeholder="Variable Value"
                  className="form-control form-control-sm"
                />
              </div>
            </div>
          </div>
        );
      case "2":
        return (
          <div>
            {/* Render Function Call form */}
            <div className="mb-2">
              <strong> Function Call</strong>
            </div>
            <input
              type="text"
              placeholder="Function Name"
              className="form-control form-control-sm mb-2"
            />
            <input
              type="text"
              placeholder="Parameters"
              className="form-control form-control-sm mb-2"
            />
          </div>
        );
      case "3":
        return (
          <div>
            {/* Render Custom Code form */}
            <div className="mb-2">
              <strong> Custom Code</strong>
            </div>
            <textarea
              placeholder="Custom Code"
              className="form-control form-control-sm mb-2"
              rows="3"
            ></textarea>
          </div>
        );
      case "4":
        return (
          <div>
            <div className="mb-2">
              <strong>Conditional Statements</strong>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option>Select</option>
                  <option value="if_else">IF ELSE</option>
                  <option value="switch_case">SWITCH CASE</option>
                  <option value="while">WHILE</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      option.value !== selectedOption
  );

  return (
    <div className="d-flex flex-column h-100">
      <input
        type="text"
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        placeholder="New child name"
        className="form-control form-control-sm mb-2"
      />

      <div className="mb-2 position-relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search options"
          className="form-control form-control-sm"
        />
        {searchTerm && (
          <ul className="list-group position-absolute w-100 z-1">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setSelectedOption(option.value);
                  setSearchTerm(""); // Clear search term to hide the list
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {renderAdditionalFields()}

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddTreeNode;
