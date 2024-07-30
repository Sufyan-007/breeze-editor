import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ParamInput from "./ParamInput";

function FunctionCallEdit({ config, functionConfig, update , hideName=false}) {
  const [conf, setConf] = useState({ ...config });
  
  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  const handleUpdate = (i, val) => {
    setConf((prevState) => {
      const newParams = [...prevState.parameters];
      newParams[i].value = val;
      return { ...prevState, parameters: newParams };
    });
  };

  return (
    <>
      <div className="d-flex h-100 flex-column justify-content-between">
        <div>
          {!hideName && <p className="mb-2" style={{ fontSize: "16px" }}>
            {" "}
            Name : {config?.functionName}
          </p>}
          <div>
            <strong>Param Mapping</strong>
            {config.parameters &&
              config.parameters.map((param, i) => (
                <div className="my-2 border border-gray p-2" key={i}>
                  <ParamInput
                    param={param}
                    value={param.value}
                    onChange={(value) => handleUpdate(i, value)}
                  />
                </div>
              ))}
              {config.parameters && config.parameters.length === 0 && <div className="my-2">No Params Present</div>}
          </div>
        </div>
        <div className="my-3 d-flex justify-content-between">
          <Button
            variant="success"
            className="btn btn-sm"
            onClick={() => update(conf)}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

export default FunctionCallEdit;
