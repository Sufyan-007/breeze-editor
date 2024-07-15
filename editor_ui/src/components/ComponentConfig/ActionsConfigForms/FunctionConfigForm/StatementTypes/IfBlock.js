import { useState } from "react";
import FunctionConfigStack from "../FunctionConfigStack";
import  Offcanvas  from "../../../../common/Offcanvas"
import IfBlockEdit from "../../../FunctionItemComponents/IfBlock";

export default function IfBlock({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false)
  const [blockConfig, setBlockConfig] = useState(config)

  console.log(isOffcanvasOpen )

  function handleOpen() {
    
    setOffCanvasOpen(true)
    
  }
  
  function update(val, key) {
    setBlockConfig(state => {

      const newState = { ...state, [key]: val }
      updateParent(newState)
      return newState
    })
  }


  function handleClose(val) {
    if (val) {
      setBlockConfig(val)
      updateParent(val)
    }
    setOffCanvasOpen(false)
  }

  return (
    <>
      <div className="if-block border border-light px-2 py-1">
        <strong>If:</strong>{" "}
        {config.condition.value}
        <div className="" style={{ cursor: "pointer" }} onClick={() => handleOpen()}>
          <i className="bi bi-plus-circle"></i>edit
        </div>
        <div className="px-3">
          <FunctionConfigStack config={blockConfig.bodyConfig} updateParent={val => update(val, "bodyConfig")} />
        </div>
        {config.elseBody && (
          <>
            <strong>Else:</strong>
            <div className="px-3">
              <FunctionConfigStack config={blockConfig.elseBody} updateParent={val => console.log(val, "bodyConfig")} />

            </div>
          </>
        )}
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Add Function"}
        width="40%"

      >
        <div className="px-1">
          <IfBlockEdit config={config} update={(val) => handleClose(val)} />
        </div>
      </Offcanvas>
    </>
  );
}