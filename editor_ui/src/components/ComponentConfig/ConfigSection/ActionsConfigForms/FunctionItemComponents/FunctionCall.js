import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { ComponentContext } from "../../../ComponentConfigPage";
import ParamInput from "./ParamInput";
import FunctionCallEdit from "./FunctionCallEdit";

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
  const { componentConfig } = useContext(ComponentContext);
  const { resources } = componentConfig;
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
    tryCatch: false,
  });
  console.log(config)
  console.log(selectedServiceFunction);

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



  // const handleSave = () => {
  //   const updatedConf = { ...conf };

  //   if (conf.case === "serviceCall" && selectedServiceFunction) {
  //     updatedConf.functionName = selectedServiceFunction.name;
  //     updatedConf.parameters = selectedServiceFunction.parameters.map(
  //       (param) => ({
  //         ...param,
  //         value: paramValues[param.name],
  //       })
  //     );
  //   }
  //   var transformedConfig = updatedConf;
  //   if (checkedItems.awaitCall) {
  //     transformedConfig["isAwaited"] = true;
  //   }
  //   if (checkedItems.thenCatch) {
  //     transformedConfig = {
  //       type: "CHAINED_FUNCTIONS",
  //       functions: [
  //         transformedConfig,
  //         {
  //           type: "FUNCTION_CALL",
  //           functionName: "then",
  //           parameters: [
  //             {
  //               type: "FUNCTION",
  //               isAnonymous: true,
  //               parameters: [{ name: "res", type: "CUSTOM" }],
  //               bodyConfig: {
  //                 type: "BLOCK",
  //                 statements: [],
  //               },
  //             },
  //           ],
  //         },
  //         {
  //           type: "FUNCTION_CALL",
  //           functionName: "catch",
  //           parameters: [
  //             {
  //               type: "FUNCTION",
  //               isAnonymous: true,
  //               parameters: [{ name: "err", type: "CUSTOM" }],
  //               bodyConfig: {
  //                 type: "BLOCK",
  //                 statements: [],
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     };
  //   }

  //   if (checkedItems.declarationCall) {
  //     transformedConfig = {
  //       type: "DECLARATION",
  //       varName: "response",
  //       value: transformedConfig,
  //       declarationType: "const",
  //     };
  //   }
  //   if (checkedItems.tryCatch) {
  //     transformedConfig = {
  //       type: "TRY_CATCH",
  //       tryBody: {
  //         type: "BLOCK",
  //         statements: [transformedConfig],
  //       },
  //       catchBody: {
  //         type: "BLOCK",
  //         statements: [],
  //       },
  //     };
  //   }
  //   update(transformedConfig);
  // };

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        {conf?.case === "serviceCall" ? (
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

        ) : (
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
      </div>
      <FunctionCallEdit config={config} functionConfig={selectedFunction} hideName update={console.log} />

    </div >
  );
}

export default FunctionCall;
