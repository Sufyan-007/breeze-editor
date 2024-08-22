import React, { useContext, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { ComponentContext } from "../../../ComponentConfigPage";
import MonacoEditor from "../../../../common/MonacoEditor";
import { TEMPLATE } from "../../../../../constants/paramValueTemplate";

const ParamInput = ({ param, name, schema, onChange }) => {
  const [config, setConfig] = useState(param);
  const { componentConfig } = useContext(ComponentContext);
  const { propsVars, resources } = componentConfig;

  const randomId = useMemo(() => {
    return "id-" + Math.random().toString(36).substr(2, 9);
  }, []);

  // useEffect(() => {
  //   setConfig(param);
  // }, [param]);

  const handleDropdownChange = (event) => {
    const type = event.target.value;
    if (TEMPLATE[type]) {
      setConfig(() => {
        const conf = JSON.parse(JSON.stringify(TEMPLATE[type]));
        onChange(conf);
        return conf;
      });
    } else {
      setConfig((state) => {
        state = { $ref: type };
        onChange(state);
        return state;
      });
    }
  };

  const handlePropertyUpdate = (key, val) => {
    setConfig((state) => {
      state.properties = { ...state.properties, [key]: val };
      //test without this later
      // state = { ...state };
      onChange(state);
      return state;
    });
  };

  const handleValueChange = (val) => {
    setConfig((state) => {
      state = { ...state, value: val };
      onChange(state);
      return state;
    });
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
            value={config.type || config.$ref}
            onChange={handleDropdownChange}
            className="form-select-sm me-2"
          >
            <option value="">Select</option>

            {propsVars.map((propVar) => (
              <option key={propVar.id} value={propVar.id}>
                {propVar.name} (PropsVar)
              </option>
            ))}

            {resources
              .filter((resource) => resource.type !== "lifecycle")
              .map((resource) => (
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
            {/* {(!schema || schema.type === "ANY" || schema.type === "ARRAY") && (
              <option value="ARRAY">Array (Custom)</option>
            )} */}
            {(!schema ||
              schema.type === "ANY" ||
              schema.type === "FUNCTION") && (
              <option value="FUNCTION">Function (Custom)</option>
            )}
            <option value="NULL">Null</option>
            <option value="UNDEFINED">Undefined</option>
            <option value="CUSTOM">Custom</option>
          </Form.Select>
          {config.type === "STRING" && (
            <Form.Control
              className="form-control-sm"
              type="text"
              value={config.value}
              onChange={(event) => handleValueChange(event.target.value)}
              placeholder="Custom Input"
            />
          )}
          {config.type === "NUMERIC" && (
            <Form.Control
              className="form-control-sm"
              type="number"
              value={config.value}
              onChange={(event) => handleValueChange(event.target.value)}
              placeholder="Custom Input"
            />
          )}
          {config.type === "BOOLEAN" && (
            <div className="d-flex align-items-center mt-1">
              <Form.Check
                type="radio"
                label="True"
                name="booleanOption"
                value="true"
                checked={config.value === true}
                onChange={() => handleValueChange(true)}
                className="me-2"
              />
              <Form.Check
                type="radio"
                label="False"
                name="booleanOption"
                value="false"
                checked={config.value === false}
                onChange={() => handleValueChange(false)}
              />
            </div>
          )}
        </div>
      </div>{" "}
      <div className="ps-3 pe-2">
        {config.type === "OBJECT" && config.properties && (
          <div className="mt-2">
            {Object.entries(config?.properties).map(([key, value]) => (
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
        {config.type === "CUSTOM" && (
          <MonacoEditor
            defaultValue={config.value}
            onChange={handleValueChange}
            height="100px"
            width="100%"
            language={
              schema?.type === "FUNCTION" || "CALLBACK" ? "javascript" : "json"
            }
            id={randomId}
          />
        )}
      </div>
    </Form.Group>
  );
};

export default ParamInput;
