import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const ParamInput = ({ param, name, schema, onChange }) => {
  const [selection, setSelection] = useState(param?.type || "");
  const [customValue, setCustomValue] = useState("");

  const handleDropdownChange = (event) => {
    setSelection(event.target.value);
    if (
      event.target.value !== "STRING" &&
      event.target.value !== "NUMERIC" &&
      event.target.value !== "BOOLEAN" &&
      event.target.value !== "OBJECT"
    ) {
      handleParamChange(event.target.value);
    }
  };

  const handleCustomInputChange = (event) => {
    setCustomValue(event.target.value);
    if (param.type === "STRING") {
      handleParamChange({ type: "STRING", value: event.target.value });
    } else if (param.type === "NUMERIC") {
      handleParamChange({
        type: "NUMERIC",
        value: parseFloat(event.target.value),
      });
    } else if (param.type === "BOOLEAN") {
      handleParamChange({
        type: "BOOLEAN",
        value: event.target.value === "true",
      });
    }
  };

  const handleParamChange = (newValue) => {
    // console.log("newValue::>>", newValue);
    if (newValue === "null") {
      onChange({ type: "NULL" });
    } else if (newValue === "undefined") {
      onChange({ type: "UNDEFINED" });
    } else if (typeof newValue === "object") {
      onChange(newValue);
    } else {
      onChange({ $ref: newValue });
    }
  };

  const handlePropertyUpdate = (key, val) => {
    // console.log(key,val)
    onChange({ ...param, properties: { ...param.properties, [key]: val } });
  };

  return (
    <Form.Group>
      <div className="row mx-0 mb-1">
        <div
          className="col-3 border border-gray d-flex align-items-center px-2"
          style={{ borderRadius: "5px" }}
        >
          <Form.Label className="mb-0">{name}</Form.Label>
        </div>
        <div className="col-1 px-0 d-flex justify-content-center align-items-center">
          <i className="bi bi-arrow-right"></i>
        </div>
        <div className="col-8 px-0 d-flex align-items-center">
          <Form.Select
            value={selection}
            onChange={handleDropdownChange}
            className="form-select-sm me-2"
          >
            <option value="">Select</option>
            <option value="var1">var1</option>
            <option value="var2">var2</option>
            {param.type === "STRING" && (
              <option value="STRING">String (Custom)</option>
            )}
            {param.type === "NUMERIC" && (
              <option value="NUMERIC">Numeric (Custom)</option>
            )}
            {param.type === "BOOLEAN" && (
              <option value="BOOLEAN">Boolean (Custom)</option>
            )}
            {param.type === "OBJECT" && (
              <option value="OBJECT">Object (Custom)</option>
            )}
            <option value="null">null</option>
            <option value="undefined">undefined</option>
          </Form.Select>
          {(selection === "STRING" || selection === "NUMERIC") && (
            <Form.Control
              className="form-control-sm"
              type={param.type === "STRING" ? "text" : "number"}
              value={customValue}
              onChange={handleCustomInputChange}
              placeholder="Custom Input"
            />
          )}
          {selection === "BOOLEAN" && (
            <div className="d-flex align-items-center mt-1">
              <Form.Check
                type="radio"
                label="True"
                name="booleanOption"
                value="true"
                checked={customValue === "true"}
                onChange={handleCustomInputChange}
                className="me-2"
              />
              <Form.Check
                type="radio"
                label="False"
                name="booleanOption"
                value="false"
                checked={customValue === "false"}
                onChange={handleCustomInputChange}
              />
            </div>
          )}
        </div>
      </div>{" "}
      <div className="ps-3">
        {selection === "OBJECT" &&
          param.type === "OBJECT" &&
          param.properties && (
            <div className="mt-2 w-100">
              {Object.entries(param.properties).map(([key, value]) => (
                <ParamInput
                  key={key}
                  name={key}
                  param={value}
                  onChange={(newValue) => handlePropertyUpdate(key, newValue)}
                />
              ))}
            </div>
          )}
      </div>
    </Form.Group>
  );
};

export default ParamInput;
