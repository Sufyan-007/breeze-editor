import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import FunctionConfigStack from "../FunctionConfigStack";

function ChainedFunctionCall({ config, updateParent }) {
  const [conf, setConf] = useState(config);
  const [chainedFunctionCallOpen, setChainedFunctionCallOpen] = useState(true);
  const [uniqueId, setUniqueId] = useState("");

  const handleToggle = () => {
    setChainedFunctionCallOpen(!chainedFunctionCallOpen);
  };

  useEffect(() => {
    setConf(config);
    setUniqueId(uuidv4());
  }, [config]);

  function update(value, index) {
    if (value) {
      setConf((state) => {
        state.functions[index] = value;
        state = { ...state };
        updateParent(state);
        return state;
      });
    } else {
      setConf((state) => {
        state.functions.splice(index, 1);
        state = { ...state };
        updateParent(state);
        return state;
      });
    }
  }

  return (
    <>
      <div className="custom-code border border-gray px-2 py-1">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <div
              className="me-2"
              style={{ cursor: "pointer" }}
              onClick={handleToggle}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${uniqueId}`}
              aria-expanded={chainedFunctionCallOpen}
            >
              <i
                className={`bi ${
                  chainedFunctionCallOpen ? "bi-chevron-down" : "bi-chevron-right"
                }`}
              ></i>
            </div>
            <strong>
              {config?.type === "CHAINED_FUNCTIONS" && (
                <>Chained Function Call</>
              )}
            </strong>
          </div>
          <div
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => updateParent(null)}
          >
            <i className="bi bi-trash-fill"></i>
          </div>
        </div>
        <div
          id={`collapse-${uniqueId}`}
          className={`collapse ${chainedFunctionCallOpen ? "show" : ""}`}
        >
          {config?.functions &&
            config.functions.map((func, index) => (
              <div key={index} className="m-1">
                <FunctionConfigStack
                  config={func}
                  updateParent={(val) => update(val, index)}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ChainedFunctionCall;
