import { useState, useEffect } from "react";
import FunctionConfigStack from "../FunctionConfigStack";
import Offcanvas from "../../../../../common/Offcanvas";
import IfBlockEdit from "../../FunctionItemComponents/IfBlock";
import { v4 as uuidv4 } from "uuid";

export default function IfBlock({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);
  const [blockConfig, setBlockConfig] = useState(config);
  const [ifOpen, setIfOpen] = useState(true);
  const [elseIfOpen, setElseIfOpen] = useState([]);
  const [elseOpen, setElseOpen] = useState(true);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    setUniqueId(uuidv4());
    setElseIfOpen(config.elseIf.map(() => true));
  }, [config]);

  function handleOpen() {
    setOffCanvasOpen(true);
  }

  function update(val, key, index) {
    if (key === "elseIf") {
      setBlockConfig((state) => {
        const newState = { ...state };
        newState["elseIf"][index]["bodyConfig"] = val;
        updateParent(newState);
        return newState;
      });
    } else {
      setBlockConfig((state) => {
        const newState = { ...state, [key]: val };
        updateParent(newState);
        return newState;
      });
    }
  }

  function handleClose(val) {
    if (val) {
      setBlockConfig(val);
      updateParent(val);
    }
    setOffCanvasOpen(false);
  }

  function deleteBlock(key) {
    const newConfig = { ...blockConfig };
    delete newConfig[key];
    setBlockConfig(newConfig);
    updateParent(newConfig);
  }

  return (
    <>
      <div className="if-block border border-gray px-2 py-1">
        {/* If Block */}
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div
              className="me-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIfOpen(!ifOpen)}
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-if-${uniqueId}`}
              aria-expanded={ifOpen}
            >
              <i
                className={`bi ${
                  ifOpen ? "bi-chevron-down" : "bi-chevron-right"
                }`}
              ></i>
            </div>
            <div>
              <strong>If:</strong> {config.condition.value}
            </div>
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
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => updateParent(null)}
            >
              <i className="bi bi-trash-fill"></i>
            </div>
          </div>
        </div>
        <div
          id={`collapse-if-${uniqueId}`}
          className={`collapse ${ifOpen ? "show" : ""}`}
        >
          <div className="px-3 mb-1">
            <FunctionConfigStack
              config={blockConfig.bodyConfig}
              updateParent={(val) => update(val, "bodyConfig")}
            />
          </div>
        </div>

        {/* Else If Blocks */}
        {config.elseIf.length > 0 && (
          <>
            {config.elseIf.map((item, i) => (
              <div key={i}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <div
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setElseIfOpen((prev) =>
                          prev.map((open, idx) =>
                            idx === i ? !open : open
                          )
                        )
                      }
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-elseif-${uniqueId}-${i}`}
                      aria-expanded={elseIfOpen[i]}
                    >
                      <i
                        className={`bi ${
                          elseIfOpen[i]
                            ? "bi-chevron-down"
                            : "bi-chevron-right"
                        }`}
                      ></i>
                    </div>
                    <div>
                      <strong>Else If:</strong> {item.condition.value}
                    </div>
                  </div>
                </div>
                <div
                  id={`collapse-elseif-${uniqueId}-${i}`}
                  className={`collapse ${elseIfOpen[i] ? "show" : ""}`}
                >
                  <div className="px-3 mb-1">
                    <FunctionConfigStack
                      config={blockConfig.elseIf[i].bodyConfig}
                      updateParent={(val) => update(val, "elseIf", i)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Else Block */}
        {config.elseBody && (
          <>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <div
                  className="me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setElseOpen(!elseOpen)}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-else-${uniqueId}`}
                  aria-expanded={elseOpen}
                >
                  <i
                    className={`bi ${
                      elseOpen ? "bi-chevron-down" : "bi-chevron-right"
                    }`}
                  ></i>
                </div>
                <div>
                  <strong>Else:</strong>
                </div>
              </div>
              <div
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => deleteBlock("elseBody")}
              >
                <i className="bi bi-trash-fill"></i>
              </div>
            </div>
            <div
              id={`collapse-else-${uniqueId}`}
              className={`collapse ${elseOpen ? "show" : ""}`}
            >
              <div className="px-3 mb-1">
                <FunctionConfigStack
                  config={blockConfig.elseBody}
                  updateParent={(val) => update(val, "elseBody")}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Offcanvas for editing If Block */}
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Edit If Block"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <IfBlockEdit config={config} update={(val) => handleClose(val)} />
        </div>
      </Offcanvas>
    </>
  );
}
