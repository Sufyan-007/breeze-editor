import { useEffect, useState } from "react"
import FunctionConfigStack from "../FunctionConfigStack"

export default function Block({config , updateParent }) {
    const [blockConfig,setBlockConfig] = useState(config)
    console.log(blockConfig)

    useEffect(()=>{
        setBlockConfig(config)
    },[config])

    function addStatement(newStatement){
        console.log(config)
        setBlockConfig((state)=>{
            state.statements.push({
                type:"IF_BLOCK",
                condition:{
                    type:"TOKEN",
                    value:"true"
                },
                bodyConfig:{
                    type:"BLOCK",
                    statements: []
                },
                elseBody:{
                    type:"BLOCK",
                    statements:[]
                }
            })
            updateParent(state)
            return {...state}
        })
    }

    function updateChild(child,index){
        setBlockConfig((state)=>{
            state.statements[index] = child
            updateParent(state)
            return {...state}
        })
    }


    return (
        <div>
            <div
                className="d-flex justify-content-between mt-1"
                style={{ fontSize: "14px" }}
            >
                <div>Add function</div>
                <div className="" style={{ cursor: "pointer" }} onClick={() =>addStatement()}>
                    <i className="bi bi-plus-circle"></i>
                </div>
            </div>
            <div className="function-config-stack mt-1" style={{ fontSize: "14px" }}>
                {blockConfig.statements.map((conf,index)=>{
                    return <FunctionConfigStack config={conf} updateParent={(newChild)=>updateChild(newChild,index)}/>
                })
                }
            </div>
            {/* <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title={"Add Function"}
        width="40%"
        footer={
          <div className="d-flex justify-content-between">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleSubmit(formResponse)}
            >
              Save
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="ml-auto"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="px-1">
          <AddFunctionItem onChange={handleFunctionItemChange} />
        </div>
      </Offcanvas> */}
        </div>
    )
}