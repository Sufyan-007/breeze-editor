import React, { useState, useEffect, useContext, useMemo } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { ComponentContext } from "../../../ComponentConfigPage";
import FunctionCallEdit from "./FunctionCallEdit";
import { staticServiceList } from "../../../../../constants/datatype";

function FunctionCall({ config, update }) {
  const [conf, setConf] = useState({ ...config });
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
  });

  const { componentConfig } = useContext(ComponentContext);
  const resources = componentConfig.resources;
  const props = componentConfig.propsVars;

  const functionList = useMemo(() => {
    const stateVarFunctions = resources
      .filter((resource) => resource.type === "stateVars")
      .map((stateVar) => {
        return {
          ...stateVar,
          name: `set${stateVar.name
            .charAt(0)
            .toUpperCase()}${stateVar.name.slice(1)}`,
        };
      });

    const functionProps = props.filter(
      (prop) => prop.body.datatype === "FUNCTION"
    );

    return [
      ...resources.filter((resource) => resource.type === "function"),
      ...stateVarFunctions,
      ...functionProps,
    ];
  }, [resources, props]);

  useEffect(() => {
    if (selectedFunction) {
      setConf((state) => {
        return { ...state, functionName: selectedFunction.name };
      });
    } else {
      setConf((state) => {
        return { ...state, functionName: null };
      });
    }
  }, [selectedFunction, conf?.case]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  useEffect(() => {
    if (selectedFunction) {
      setConf((prevState) => ({
        ...prevState,
        functionName: selectedFunction.name,
        parameters: selectedFunction.parameters,
      }));
    }
  }, [selectedFunction, functionList, conf?.case]);

  const handleSave = (conf) => {
    var transformedConfig = conf;
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

    update(transformedConfig);
  };

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        {conf?.callType === "serviceCall" ? (
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
                  setSelectedFunction(
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
        ) : (
          <Row className="mb-2">
            <Col sm={12}>
              <Form.Select
                className="form-select-sm"
                value={JSON.stringify(selectedFunction) || ""}
                onChange={(e) =>
                  setSelectedFunction(JSON.parse(e.target.value))
                }
              >
                <option value="">Select function</option>
                {Object.keys(functionList).map((key, index) => (
                  <option key={index} value={JSON.stringify(functionList[key])}>
                    {functionList[key].name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}
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
              <label className="form-check-label" htmlFor="declarationCall">
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
          </div>
        </Row>
      </div>
      {conf.functionName && selectedFunction && (
        <FunctionCallEdit
          config={conf}
          functionConfig={selectedFunction}
          hideName
          update={handleSave}
        />
      )}
    </div>
  );
}

export default FunctionCall;
