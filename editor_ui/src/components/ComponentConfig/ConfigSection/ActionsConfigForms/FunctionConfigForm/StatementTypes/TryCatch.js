import { useState, useEffect } from "react";
import { v4 as collapseId } from "uuid";
import FunctionConfigStack from "../FunctionConfigStack";

export default function TryCatch({ config, updateParent }) {
  const [blockConfig, setBlockConfig] = useState(config);
  const [isTryOpen, setIsTryOpen] = useState(true);
  const [isCatchOpen, setIsCatchOpen] = useState(true);
  const [isFinallyOpen, setIsFinallyOpen] = useState(true);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    setUniqueId(collapseId());
  }, []);

  const handleToggleTry = () => {
    setIsTryOpen(!isTryOpen);
  };

  const handleToggleCatch = () => {
    setIsCatchOpen(!isCatchOpen);
  };

  const handleToggleFinally = () => {
    setIsFinallyOpen(!isFinallyOpen);
  };

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
          <div className="d-flex">
            <div
              className="me-2"
              style={{ cursor: "pointer" }}
              onClick={handleToggleTry}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-try-${uniqueId}`}
              aria-expanded={isTryOpen}
            >
              <i
                className={`bi ${
                  isTryOpen ? "bi-chevron-down" : "bi-chevron-right"
                }`}
              ></i>
            </div>
            <div className="">
              <strong>Try Block</strong>
            </div>
          </div>
          <div
            className=""
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => updateParent(null)}
          >
            <i className="bi bi-trash-fill"></i>
          </div>
        </div>
        <div
          id={`collapse-try-${uniqueId}`}
          className={`collapse ${isTryOpen ? "show" : ""}`}
        >
          <div className="px-3 mb-1">
            <FunctionConfigStack
              config={blockConfig.tryBody}
              updateParent={(val) => update(val, "tryBody")}
            />
          </div>
        </div>
        {config.catchBody && (
          <>
            <div className="d-flex">
              <div
                className="me-2"
                style={{ cursor: "pointer" }}
                onClick={handleToggleCatch}
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-catch-${uniqueId}`}
                aria-expanded={isCatchOpen}
              >
                <i
                  className={`bi ${
                    isCatchOpen ? "bi-chevron-down" : "bi-chevron-right"
                  }`}
                ></i>
              </div>
              <div>
                <strong>Catch Block</strong>
              </div>
            </div>
            <div
              id={`collapse-catch-${uniqueId}`}
              className={`collapse ${isCatchOpen ? "show" : ""}`}
            >
              <div className="px-3">
                <FunctionConfigStack
                  config={blockConfig.catchBody}
                  updateParent={(val) => update(val, "catchBody")}
                />
              </div>
            </div>
          </>
        )}
        {config.finallyBody && (
          <>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <div
                  className="me-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleToggleFinally}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-finally-${uniqueId}`}
                  aria-expanded={isFinallyOpen}
                >
                  <i
                    className={`bi ${
                      isFinallyOpen ? "bi-chevron-down" : "bi-chevron-right"
                    }`}
                  ></i>
                </div>
                <div className="">
                  <strong>Finally</strong>
                </div>
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
            <div
              id={`collapse-finally-${uniqueId}`}
              className={`collapse ${isFinallyOpen ? "show" : ""}`}
            >
              <div className="px-3">
                <FunctionConfigStack
                  config={blockConfig.finallyBody}
                  updateParent={(val) => update(val, "finallyBody")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
