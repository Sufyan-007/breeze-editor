import React, { useState, useEffect } from "react";

const UpdateVariable = ({ onChange }) => {
  const [variableInfo, setVariableInfo] = useState({
    variableName: "",
    dataType: "STRING",
    value: "",
    refId: "",
  });
  const [isCustomValue, setIsCustomValue] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariableInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSwitchChange = () => {
    setIsCustomValue((prev) => !prev);
    setVariableInfo((prevInfo) => ({
      ...prevInfo,
      value: "",
      refId: "",
    }));
  };

  useEffect(() => {
    let valueObject;

    if (isCustomValue) {
      switch (variableInfo.dataType) {
        case "OBJECT":
          try {
            valueObject = {
              type: "OBJECT",
              properties: JSON.parse(variableInfo.value),
            };
          } catch (e) {
            alert("Invalid JSON for object properties");
            return;
          }
          break;
        default:
          valueObject = {
            type: variableInfo.dataType,
            value: variableInfo.value,
          };
      }
    } else {
      valueObject = { $ref: variableInfo.refId };
    }

    const assignment = {
      type: "ASSIGNMENT",
      varName: variableInfo.variableName,
      value: valueObject,
    };

    onChange(assignment);
    // setVariableInfo({
    //   variableName: "",
    //   dataType: "STRING",
    //   value: "",
    //   refId: "",
    // });
  }, [variableInfo, isCustomValue, onChange]);

  return (
    <div className="px-1 py-2">
      <form className="variable-assignment-form">
        <div className="form-group mb-2">
          <label htmlFor="variableName">Variable Name</label>
          <input
            type="text"
            id="variableName"
            name="variableName"
            placeholder="name"
            value={variableInfo.variableName}
            onChange={handleChange}
            className="form-control form-control-sm mt-1"
            required
          />
        </div>
        <div className="form-group mb-2 d-flex align-items-center">
          <label htmlFor="customValueSwitch" className="me-2">
            Value Type
          </label>
          <div className="form-check form-switch mt-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="customValueSwitch"
              checked={isCustomValue}
              onChange={handleSwitchChange}
            />
            <label className="form-check-label" htmlFor="customValueSwitch">
              {isCustomValue ? "Custom" : "Reference"}
            </label>
          </div>
        </div>
        {isCustomValue ? (
          <>
            <div className="form-group mb-2">
              <label htmlFor="dataType">Data Type</label>
              <select
                id="dataType"
                name="dataType"
                value={variableInfo.dataType}
                onChange={handleChange}
                className="form-control form-control-sm mt-1"
              >
                <option value="STRING">String</option>
                <option value="NUMBER">Number</option>
                <option value="ARRAY">Array</option>
                <option value="OBJECT">Object</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="EXPRESSION">Expression</option>
                <option value="DECIMAL">Decimal</option>
                <option value="DATE">Date</option>
                <option value="NULL">Null</option>
                <option value="CUSTOM">Custom</option>
                <option value="TOKEN">Token</option>
              </select>
            </div>
            <div className="form-group mb-2">
              <label htmlFor="value">Value</label>
              <input
                type="text"
                id="value"
                name="value"
                placeholder="value"
                value={variableInfo.value}
                onChange={handleChange}
                className="form-control form-control-sm mt-1"
                required
              />
            </div>
          </>
        ) : (
          <div className="form-group mb-2">
            <label htmlFor="refId">Reference</label>
            <select
              id="refId"
              name="refId"
              value={variableInfo.refId}
              onChange={handleChange}
              className="form-control form-control-sm mt-1"
            >
              <option value="">Select Reference</option>
              {/* Add your reference options here */}
              <option value="ref1">Reference 1</option>
              <option value="ref2">Reference 2</option>
            </select>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateVariable;
