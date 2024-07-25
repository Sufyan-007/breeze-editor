import React, { useState, useEffect } from "react";
import FunctionConfigStack from "../FunctionConfigStack";

function ChainedFunctionCall({ config, updateParent }) {
  const [conf, setConf] = useState(config);

  useEffect(() => {
    setConf(config);
  }, [config]);

  function update(value, index) {
    if (value) {
      setConf((state) => {
        state.functions[index] = value;
        state = { ...state };
        updateParent(state);
        return state;
      });
    }else{
      setConf(state=>{
        state.functions.splice(index,1)
        state = { ...state };
        updateParent(state);
        return state;
      })
    }

  }
  return (
    <>
      <div className="custom-code border border-gray px-2 py-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>
              {config?.type === "CHAINED_FUNCTIONS" && (
                <>Chained Function Call</>
              )}
            </strong>
          </div>
          <div className="d-flex">
            <div
              className=""
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => updateParent(null)}
            >
              <i className="bi bi-trash-fill"></i>
            </div>
          </div>
        </div>
        {config?.functions &&
          config.functions.map((func, index) => {
            return (
              <div key={index} className="m-1">
                {" "}
                <FunctionConfigStack
                  config={func}
                  updateParent={(val) => update(val, index)}
                />
              </div>
            );
          })}
      </div>
      {/* <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Edit"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <FunctionCallEdit
            config={config}
            update={(val) => handleClose(val)}
          />
        </div>
      </Offcanvas> */}
    </>
  );
}

export default ChainedFunctionCall;
