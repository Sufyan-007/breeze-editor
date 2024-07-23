import { useState } from "react";
import Offcanvas from "../../../../../common/Offcanvas";
import FunctionCallEdit from "../../FunctionItemComponents/FunctionCall";

export default function FunctionCall({ config, updateParent }) {
  console.log("config::>>", config);
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);

  function handleOpen() {
    setOffCanvasOpen(true);
  }

  function handleClose(val) {
    if (val) {
      console.log(val);
      updateParent(val);
    }
    setOffCanvasOpen(false);
  }
  return (
    <>
      <div className="custom-code border border-light px-2 py-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>{config.case} :</strong> {config.functionName}
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
        title={"Edit"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <FunctionCallEdit
            config={config}
            update={(val) => handleClose(val)}
          />
        </div>
      </Offcanvas>
    </>
  );
}
