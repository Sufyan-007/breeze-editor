import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { ComponentContext } from "../../../ComponentConfigPage";
import ParamInput from "./ParamInput";

const staticServiceList = {
  userService: {
    createUser: {
      name: "createUser",
      parameters: [
        { type: "STRING", name: "name" },
        { type: "STRING", name: "username" },
      ],
    },
  },
};

function FunctionCall({ config, update }) {
  const [conf, setConf] = useState({ ...config });
  const [functionList, setFunctionList] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(
    config.functionName || ""
  );
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceFunction, setSelectedServiceFunction] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const { componentConfig } = useContext(ComponentContext);
  const { resources } = componentConfig;
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
    tryCatch: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };

  useEffect(() => {
    setConf({ ...config });
    setSelectedFunction(config.functionName || "");
  }, [config]);

  useEffect(() => {
    const functions = resources.filter(
      (resource) => resource.type === "function"
    );
    setFunctionList(functions);
  }, [resources]);

  useEffect(() => {
    const selectedFunc = functionList.find(
      (func) => func.name === selectedFunction
    );
    if (selectedFunc) {
      setConf((prevState) => ({
        ...prevState,
        functionName: selectedFunc.name,
        parameters: selectedFunc.parameters.map((param) => ({
          ...param,
          value:
            param.type === "OBJECT" ? {} : param.type === "ARRAY" ? [] : "",
        })),
      }));
    }
  }, [selectedFunction, functionList]);

  const handleUpdate = (index, value) => {
    setConf((prevState) => {
      const newParams = [...prevState.parameters];
      newParams[index].value = value;
      return { ...prevState, parameters: newParams };
    });
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

  const handleSave = () => {
    const updatedConf = { ...conf };

    if (conf.case === "serviceCall" && selectedServiceFunction) {
      updatedConf.functionName = selectedServiceFunction.name;
      updatedConf.parameters = selectedServiceFunction.parameters.map(
        (param) => ({
          ...param,
          value: paramValues[param.name],
        })
      );
    }
    var transformedConfig = updatedConf;
    if (checkedItems.awaitCall) {
      transformedConfig["isAwaited"] = true;
    }
    if (checkedItems.thenCatch) {
      transformedConfig = {
        type: "CHAINED_FUNCTIONS",
        functions: [
          transformedConfig,
          {
            type: "FUNCTION_CALL",
            functionName: "then",
            parameters: [
              {
                type: "FUNCTION",
                isAnonymous: true,
                parameters: [{ name: "res", type: "CUSTOM" }],
                bodyConfig: {
                  type: "BLOCK",
                  statements: [],
                },
              },
            ],
          },
          {
            type: "FUNCTION_CALL",
            functionName: "catch",
            parameters: [
              {
                type: "FUNCTION",
                isAnonymous: true,
                parameters: [{ name: "err", type: "CUSTOM" }],
                bodyConfig: {
                  type: "BLOCK",
                  statements: [],
                },
              },
            ],
          },
        ],
      };
    }

    if (checkedItems.declarationCall) {
      transformedConfig = {
        type: "DECLARATION",
        varName: "response",
        value: transformedConfig,
        declarationType: "const",
      };
    }
    if (checkedItems.tryCatch) {
      transformedConfig = {
        type: "TRY_CATCH",
        tryBody: {
          type: "BLOCK",
          statements: [transformedConfig],
        },
        catchBody: {
          type: "BLOCK",
          statements: [],
        },
      };
    }
    update(transformedConfig);
  };


  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      {conf?.case === "serviceCall" ? (
        <div>
          <Row className="mb-2">
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
          {selectedServiceFunction && (
            <div>
              <Row className="mb-2 px-1">
                <Form.Label>
                  <strong>Configure the service call</strong>
                </Form.Label>
                <div className="d-flex">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="thenCatch"
                      id="thenCatch"
                      checked={checkedItems.thenCatch.checked}
                      onChange={handleCheckboxChange}
                      disabled={checkedItems.thenCatch.disabled}
                    />
                    <label className="form-check-label" htmlFor="thenCatch">
                      Then catch
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="declarationCall"
                      id="declarationCall"
                      checked={checkedItems.declarationCall.checked}
                      onChange={handleCheckboxChange}
                      disabled={checkedItems.declarationCall.disabled}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="declarationCall"
                    >
                      Declaration
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="awaitCall"
                      id="awaitCall"
                      checked={checkedItems.awaitCall.checked}
                      onChange={handleCheckboxChange}
                      disabled={checkedItems.awaitCall.disabled}
                    />
                    <label className="form-check-label" htmlFor="awaitCall">
                      Await
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="tryCatch"
                      id="tryCatch"
                      checked={checkedItems.tryCatch.checked}
                      onChange={handleCheckboxChange}
                      disabled={checkedItems.tryCatch.disabled}
                    />
                    <label className="form-check-label" htmlFor="tryCatch">
                      Try catch
                    </label>
                  </div>
                </div>
              </Row>
              <strong>Parameter Mapping</strong>
              {selectedServiceFunction.parameters.length > 0 &&
                selectedServiceFunction.parameters.map((param, index) => (
                  <div className="mb-2 border border-gray p-2" key={index}>
                    <ParamInput
                      param={param}
                      value={paramValues[param.name]}
                      onChange={(value) =>
                        handleParamChange([param.name], value)
                      }
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Row className="mb-2">
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
                  <option key={index} value={func.name}>
                    {func.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {selectedFunction && (
            <div>
              <Row className="mb-2 px-1">
                <Form.Label>
                  <strong>Configure the function call</strong>
                </Form.Label>
                <div className="d-flex">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="thenCatch"
                      id="thenCatch"
                      checked={checkedItems.thenCatch}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="thenCatch">
                      Then catch
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="declarationCall"
                      id="declarationCall"
                      checked={checkedItems.declarationCall}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="declarationCall"
                    >
                      Declaration
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="awaitCall"
                      id="awaitCall"
                      checked={checkedItems.awaitCall}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="awaitCall">
                      Await
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="tryCatch"
                      id="tryCatch"
                      checked={checkedItems.tryCatch}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="tryCatch">
                      Try catch
                    </label>
                  </div>
                </div>
              </Row>
              <strong>Parameter Mapping</strong>
              {conf.parameters &&
                conf.parameters.map((param, index) => (
                  <div className="mb-2 border border-gray p-2" key={index}>
                    <ParamInput
                      param={param}
                      value={param.value}
                      onChange={(value) => handleUpdate(index, value)}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      <div className="my-3 d-flex justify-content-between">
        <Button variant="success" className="btn btn-sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default FunctionCall;
