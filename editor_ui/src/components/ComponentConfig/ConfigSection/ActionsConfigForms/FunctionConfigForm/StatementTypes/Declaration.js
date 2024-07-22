import { useState } from "react";
import Offcanvas from "../../../../../common/Offcanvas";
import CreateVariable from "../../FunctionItemComponents/CreateVariable";

export default function Declaration({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);

  function handleOpen() {
    setOffCanvasOpen(true);
  }

  function handleClose(val) {
    if (val) {
      updateParent(val);
    }
    setOffCanvasOpen(false);
  }

  return (
    <>
      <div className="declaration border border-light px-2 py-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Variable:</strong> {config.declarationType} {config.varName}
            {config?.value?.value ? ` = ${config.value.value}` : ""}
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
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Edit Variable"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <CreateVariable config={config} update={(val) => handleClose(val)} />
        </div>
      </Offcanvas>
    </>
  );
}
