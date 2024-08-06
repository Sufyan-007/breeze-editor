import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ParamInput from "./ParamInput";

function FunctionCallEdit({
  config,
  functionConfig,
  update,
  hideName = false,
}) {
  const [conf, setConf] = useState({ ...config });
  const [funcConfig, setFuncConfig] = useState(functionConfig);

  useEffect(() => {
    setFuncConfig(functionConfig);
  }, [functionConfig]);

  useEffect(() => {
    if(config){
    setConf({ ...config });}
  }, [config]);

  const handleUpdate = (i, val) => {
    setConf((prevState) => {
      const newParams = [...prevState.parameters];
      newParams[i] = val;
      return { ...prevState, parameters: newParams };
    });
  };

  const handleAddParam = () => {
    setConf((prevState) => {
      const newParams = prevState.parameters ? [...prevState.parameters] : [];
      newParams.push({ type: "UNDEFINED" });
      return { ...prevState, parameters: newParams };
    });
  };

  return (
    <>
      <div className="d-flex h-100 flex-column justify-content-between">
        <div>
          {!hideName && (
            <p className="mb-2" style={{ fontSize: "16px" }}>
              Name: {config?.functionName}
            </p>
          )}
          <div>
            <strong>Param Mapping</strong>
            {conf.parameters &&
              conf.parameters.map((param, i) => (
                <div className="my-2 border border-gray p-2" key={i}>
                  <ParamInput
                    param={param}
                    name={
                      (functionConfig?.parameters &&
                        functionConfig.parameters[i]?.name) ||
                      "PARAM-" + i
                    }
                    schema={
                      functionConfig?.parameters && functionConfig.parameters[i]
                    }
                    onChange={(value) => handleUpdate(i, value)}
                  />
                </div>
              ))}
            {conf?.parameters && conf?.parameters.length === 0 && (
              <div className="my-2">No Params Present</div>
            )}
            {!functionConfig?.parameters && (
              <div className="d-flex justify-content-end">
                <Button className="btn btn-sm" variant="secondary" onClick={handleAddParam}>
                  Add Param
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="my-3 d-flex justify-content-between">
          <Button
            variant="success"
            className="btn btn-sm"
            onClick={() => {
              console.log(conf)
              update(conf);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

export default FunctionCallEdit;
