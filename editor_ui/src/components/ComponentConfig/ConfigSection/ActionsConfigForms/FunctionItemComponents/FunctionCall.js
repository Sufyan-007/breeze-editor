import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ParameterInput from "./ParamInput";

const staticServiceList = {
  userService: {
    getUser: {
      name: "getUser",
      parameters: [
        {
          type: "OBJECT",
          name: "PathParameters",
          properties: [
            { type: "STRING", name: "userId" },
            { type: "STRING", name: "messageId" },
          ],
        },
        {
          type: "OBJECT",
          name: "BodyPayload",
          properties: [
            {
              type: "OBJECT",
              name: "UpdatedUserDetails",
              properties: [
                { name: "name", type: "STRING" },
                { name: "username", type: "STRING" },
              ],
            },
            {
              type: "OBJECT",
              name: "OldUserDetails",
              properties: [
                { name: "name", type: "STRING" },
                { name: "username", type: "STRING" },
              ],
            },
          ],
        },
      ],
    },
    createUser: {
      name: "createUser",
      parameters: [
        { type: "STRING", name: "name" },
        { type: "STRING", name: "username" },
      ],
    },
  },
};

function FunctionCall({ onChange }) {
  const [option, setOption] = useState("");
  const [functionList] = useState(["getUser", "createUser"]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceFunction, setSelectedServiceFunction] = useState(null);
  const [paramValues, setParamValues] = useState({});
  
  const handleOptionChange = (e) => {
    setOption(e.target.value);
    setSelectedFunction("");
    setSelectedService("");
    setSelectedServiceFunction(null);
    setParamValues({});
  };

  const handleParamChange = (path, value) => {
    setParamValues((prevValues) => {
      const updatedValues = { ...prevValues };
      let current = updatedValues;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updatedValues;
    });
  };

  const mapParameters = (params, values) => {
    return params.map((param) => {
      if (param.type === "OBJECT") {
        const mappedProperties = param.properties.reduce((acc, prop) => {
          const propValue = mapParameters([prop], values[param.name] || {})[0];
          return { ...acc, [prop.name]: propValue };
        }, {});
        return { type: param.type, properties: mappedProperties };
      }
      if (param.type === "ARRAY") {
        const mappedValues = (Array.isArray(values[param.name]) ? values[param.name] : []).map((val, idx) => ({
          type: param.values[idx] ? param.values[idx].type : param.type,
          value: val,
        }));
        return { type: param.type, values: mappedValues };
      }
  
      return { type: param.type, value: values[param.name] || "" };
    });
  };
  
  const generateConfig = () => {
    if (selectedServiceFunction) {
      const config = {
        type: "BLOCK",
        statements: [
          {
            type: "FUNCTION_CALL",
            functionName: selectedServiceFunction.name,
            parameters: mapParameters(
              selectedServiceFunction.parameters,
              paramValues
            ),
          },
        ],
      };
      console.log("Generated Config: ", config);
    }
  };

  return (
    <div className="mt-3">
      <Row className="mb-3">
        <Col sm={12}>
          <Form.Select
            className="form-select-sm"
            value={option}
            onChange={handleOptionChange}
          >
            <option disabled value="">
              Select Type
            </option>
            <option value="functionCall">Functions</option>
            <option value="serviceCall">Services</option>
          </Form.Select>
        </Col>
      </Row>

      {option === "functionCall" && (
        <Row className="mb-3">
          <Col sm={12}>
            <Form.Select
              className="form-select-sm"
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              <option disabled value="">
                Select function
              </option>
              {functionList.map((func, index) => (
                <option key={index} value={func}>
                  {func}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      )}

      {option === "serviceCall" && (
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Select
              className="form-select-sm"
              value={selectedService || ""}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option disabled value="">
                Services
              </option>
              {Object.keys(staticServiceList).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col sm={6}>
            <Form.Select
              defaultValue=""
              className="form-select-sm"
              onChange={(e) => {
                setSelectedServiceFunction(
                  staticServiceList[selectedService][e.target.value]
                );
              }}
            >
              <option value="">Service Functions</option>
              {Object.keys(staticServiceList[selectedService] || {}).map(
                (func) => (
                  <option key={func} value={func}>
                    {staticServiceList[selectedService][func]["name"]}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
        </Row>
      )}

      {selectedServiceFunction && (
        <div>
          <h5>Parameter Mapping</h5>
          {selectedServiceFunction.parameters.map((param, index) => (
            <div className="mb-2 border border-gray p-2" key={index}>
              <ParameterInput
                param={param}
                value={paramValues[param.name]}
                onChange={(value) => handleParamChange([param.name], value)}
              />
            </div>
          ))}
          {/* <Button onClick={generateConfig}>Generate Config</Button> */}
        </div>
      )}
    </div>
  );
}

export default FunctionCall;
