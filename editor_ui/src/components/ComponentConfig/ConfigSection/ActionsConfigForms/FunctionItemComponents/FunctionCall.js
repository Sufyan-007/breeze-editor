import React, { useState, useEffect, useContext, useMemo } from "react";
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
  const { componentConfig } = useContext(ComponentContext);
  const resources = componentConfig.resources;
  const functionList = useMemo(() => {
    return resources.filter(
      (resource) => resource.type === "function"
    );
  }, [resources]);
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedService, setSelectedService] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    thenCatch: false,
    declarationCall: false,
    awaitCall: false,
    tryCatch: false,
  });

  useEffect(()=>{
    if(selectedFunction){
      setConf((state)=>{
        return {...state,functionName:selectedFunction.name}
      })
    }
    else{
      setConf((state)=>{
        return {...state,functionName:null}
      })
    }
  },[selectedFunction])

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
    // const selectedFunc = functionList.find(
    //   (func) => func.name === selectedFunction
    // );
    if (selectedFunction) {
      setConf((prevState) => ({
        ...prevState,
        functionName: selectedFunction.name,
        parameters: []
      }));
    }
  }, [selectedFunction, functionList]);


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
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
              >
                <option disabled value="">
                  Select function
                </option>
                {functionList.map((func, index) => (
                  <option key={index} value={func}>
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
      {conf.functionName &&
        <FunctionCallEdit config={conf} functionConfig={selectedFunction} hideName update={console.log} />
      }
    </div >
  );
}

export default FunctionCall;
