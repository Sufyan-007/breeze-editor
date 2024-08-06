import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { ComponentContext } from "../../../ComponentConfigPage";
import MonacoEditor from "../../../../common/MonacoEditor";

const ParamInput = ({ param, name, schema, onChange }) => {
  const [selection, setSelection] = useState();
  const [customValue, setCustomValue] = useState("");
  const { componentConfig } = useContext(ComponentContext);
  const { propsVars, resources } = componentConfig;

  const handleDropdownChange = (event) => {
    setSelection(event.target.value);
    if (
      event.target.value !== "STRING" &&
      event.target.value !== "NUMERIC" &&
      event.target.value !== "BOOLEAN" &&
      event.target.value !== "OBJECT" &&
      event.target.value !== "ARRAY" &&
      event.target.value !== "FUNCTION"
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
    console.log("newValue::>>", newValue);
    if (newValue === "NULL") {
      onChange({ type: "NULL" });
    } else if (newValue === "UNDEFINED") {
      onChange({ type: "UNDEFINED" });
    } else if (typeof newValue === "object") {
      onChange(newValue);
    } else {
      onChange({ $ref: newValue });
    }
  };

  const handlePropertyUpdate = (key, val) => {
    onChange({ ...param, properties: { ...param.properties, [key]: val } });
  };

  const handleValue = (val) => {
    handleParamChange({ type: "CUSTOM", value: val });
  };

  console.log("param,schema::>>", param, schema);

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

            {propsVars.map((propVar) => (
              <option key={propVar.id} value={propVar.id}>
                {propVar.name} (PropsVar)
              </option>
            ))}

            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.type})
              </option>
            ))}

            {(!schema || schema.type === "ANY" || schema.type === "STRING") && (
              <option value="STRING">String (Custom)</option>
            )}
            {(!schema ||
              schema.type === "ANY" ||
              schema.type === "NUMERIC") && (
              <option value="NUMERIC">Numeric (Custom)</option>
            )}
            {(!schema ||
              schema.type === "ANY" ||
              schema.type === "BOOLEAN") && (
              <option value="BOOLEAN">Boolean (Custom)</option>
            )}
            {(!schema || schema.type === "ANY" || schema.type === "OBJECT") && (
              <option value="OBJECT">Object (Custom)</option>
            )}
            {(!schema || schema.type === "ANY" || schema.type === "ARRAY") && (
              <option value="ARRAY">Array (Custom)</option>
            )}
            {(!schema ||
              schema.type === "ANY" ||
              schema.type === "FUNCTION") && (
              <option value="FUNCTION">Function (Custom)</option>
            )}

            <option value="NULL">Null</option>
            <option value="UNDEFINED">Undefined</option>
          </Form.Select>
          {selection === "STRING" && (
            <Form.Control
              className="form-control-sm"
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              placeholder="Custom Input"
            />
          )}
          {selection === "NUMERIC" && (
            <Form.Control
              className="form-control-sm"
              type="number"
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
      <div className="ps-3 pe-2">
        {selection === "OBJECT" &&
          param.type === "OBJECT" &&
          param.properties && (
            <div className="mt-2">
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
      <div className="px-2 mt-2">
        {((selection === "OBJECT" &&
          param.type === "OBJECT" &&
          !param.properties) ||
          (selection === "ARRAY" && param.type === "ARRAY") ||
          (selection === "FUNCTION" && param.type === "FUNCTION")) && (
          <MonacoEditor
            value={customValue}
            onChange={(val) => handleValue(val)}
            height="100px"
            width="100%"
            language={selection === "FUNCTION" ? "javascript" : "json"}
            id={name + "-monaco-editor"}
          />
        )}
      </div>
    </Form.Group>
  );
};

export default ParamInput;
