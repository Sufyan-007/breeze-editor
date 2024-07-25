import { useState } from "react";
import FunctionConfigStack from "../FunctionConfigStack";
import Offcanvas from "../../../../../common/Offcanvas";
import IfBlockEdit from "../../FunctionItemComponents/IfBlock";

export default function IfBlock({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);
  const [blockConfig, setBlockConfig] = useState(config);

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
          <div className="">
            <strong>If:</strong> {config.condition.value}
          </div>
          <div className="d-flex">
            <div
              className="mx-2"
              style={{ cursor: "pointer", color: "cyan" }}
              onClick={() => handleOpen()}
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
        <div className="px-3">
          <FunctionConfigStack
            config={blockConfig.bodyConfig}
            updateParent={(val) => update(val, "bodyConfig")}
          />
        </div>
        {config.elseBody && (
          <>
            <strong>Else:</strong>
            <div className="px-3">
              <FunctionConfigStack
                config={blockConfig.elseBody}
                updateParent={(val) =>update(val, "elseBody")}
              />
            </div>
          </>
        )}
      </div>
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
