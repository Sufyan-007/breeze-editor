import { useEffect, useState } from "react"
import FunctionConfigStack from "../FunctionConfigStack"
import  Offcanvas  from "../../../../common/Offcanvas"
import AddFunctionItem from "../AddFunctionItem"

export default function Block({ config, updateParent }) {
  const [blockConfig, setBlockConfig] = useState(config)


  const [ isOffcanvasOpen, setOffCanvasOpen ] = useState(false)

  function handleClose(val){
    if(val){
      console.log(val)
      addStatement(val)
    }
    setOffCanvasOpen(false)
  }

  useEffect(() => {
    setBlockConfig(config)
  }, [config])

  function addStatement(newStatement) {
    console.log(newStatement)
    setBlockConfig((state) => {
      state.statements.push(newStatement)
      updateParent(state)
      
      return state
    })
  }

  function updateChild(child, index) {
    console.log(child)
    setBlockConfig((state) => {
      state.statements[index] = child
      updateParent(state)
      return { ...state }
    })
  }


  return (
    <div>
      <div
        className="d-flex justify-content-between mt-1"
        style={{ fontSize: "14px" }}
      >
        <div>Add function</div>
        <div className="" style={{ cursor: "pointer" }} onClick={() =>setOffCanvasOpen(true)}>
          <i className="bi bi-plus-circle"></i>
        </div>
      </div>
      <div className="function-config-stack mt-1" style={{ fontSize: "14px" }}>
        {blockConfig.statements.map((conf, index) => {
          return <FunctionConfigStack config={conf} updateParent={(newChild) => updateChild(newChild, index)} />
        })
        }
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={()=>handleClose(false)}
        title={"Add Function"}
        width="40%"
        
      >
        <div className="px-1">
          <AddFunctionItem update={(val)=>handleClose(val)} />
        </div>
      </Offcanvas>
    </div>
  )
}