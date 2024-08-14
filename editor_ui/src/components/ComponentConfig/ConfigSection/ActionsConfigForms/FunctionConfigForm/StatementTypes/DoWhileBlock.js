import { useState, useEffect } from "react";
import FunctionConfigStack from "../FunctionConfigStack";
import Offcanvas from "../../../../../common/Offcanvas";
import DoWhileLoop from "../../FunctionItemComponents/DoWhileLoop";
import { v4 as uuidv4 } from "uuid";

export default function DoWhileBlock({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);
  const [blockConfig, setBlockConfig] = useState(config);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    setUniqueId(uuidv4());
  }, []);

  function handleOpen() {
    setOffCanvasOpen(true);
  }

  function update(val, key) {
    setBlockConfig((state) => {
      const newState = { ...state, [key]: val };
      updateParent(newState);
      return newState;
    });
  }

  function handleClose(val) {
    if (val) {
      setBlockConfig(val);
      updateParent(val);
    }
    setOffCanvasOpen(false);
  }

  return (
    <>
      <div className="if-block border border-gray px-2 py-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div
              className="me-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-do-while-${uniqueId}`}
              aria-expanded={!isCollapsed}
            >
              <i
                className={`bi ${
                  isCollapsed ? "bi-chevron-right" : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <strong>Do Block</strong>
          </div>
        </div>

        <div
          id={`collapse-do-while-${uniqueId}`}
          className={`collapse ${isCollapsed ? "" : "show"}`}
        >
          <div className="px-3 mb-1">
            <FunctionConfigStack
              config={blockConfig.bodyConfig}
              updateParent={(val) => update(val, "bodyConfig")}
            />
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div className="mt-1">
              <strong>Do While:</strong> {config.condition.value}
            </div>
            <div className="d-flex">
              <div
                className="mx-2"
                style={{ cursor: "pointer", color: "cyan" }}
                onClick={handleOpen}
              >
                <i className="bi bi-pencil-square"></i>
              </div>
              <div
                className=""
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => updateParent(null)}
              >
                <i className="bi bi-trash-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Edit Do While Block"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <DoWhileLoop config={config} update={(val) => handleClose(val)} />
        </div>
      </Offcanvas>
    </>
  );
}
