import { useState } from "react";
import FunctionConfigStack from "../FunctionConfigStack";

export default function TryCatch({ config, updateParent }) {
  const [blockConfig, setBlockConfig] = useState(config);

  function update(val, key) {
    setBlockConfig((state) => {
      const newState = { ...state, [key]: val };
      updateParent(newState);
      return newState;
    });
  }

  function deleteBlock(val) {
    const newConfig = { ...blockConfig };
    delete newConfig[val];
    setBlockConfig(newConfig);
    updateParent(newConfig);
  }

  return (
    <>
      <div className="if-block border border-gray px-2 py-1">
        <div className="d-flex justify-content-between">
          <div className="">
            <strong>Try Block</strong>
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
        <div className="px-3">
          <FunctionConfigStack
            config={blockConfig.tryBody}
            updateParent={(val) => update(val, "tryBody")}
          />
        </div>
        {config.catchBody && (
          <>
            <strong>Catch Block</strong>
            <div className="px-3">
              <FunctionConfigStack
                config={blockConfig.catchBody}
                updateParent={(val) => update(val, "catchBody")}
              />
            </div>
          </>
        )}
        {config.finallyBody && (
          <>
            <div className="d-flex justify-content-between">
              <div className="">
                <strong>Finally</strong>
              </div>
              <div className="d-flex">
                <div
                  className=""
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => deleteBlock("finallyBody")}
                >
                  <i className="bi bi-trash-fill"></i>
                </div>
              </div>
            </div>
            <div className="px-3">
              <FunctionConfigStack
                config={blockConfig.finallyBody}
                updateParent={(val) => update(val, "finallyBody")}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
