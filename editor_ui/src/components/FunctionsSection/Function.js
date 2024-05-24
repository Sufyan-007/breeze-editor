
import rightArrow from "../../assets/icons/arrow_right_icon.svg"
import downArrow from "../../assets/icons/arrow_down_icon.svg"
import { useEffect, useState } from "react"
import MonacoEditor from "../common/MonacoEditor"
import { updateFunction } from "../../services/FunctionConfigService"
import { useParams } from "react-router"
import CommonConfigSidebar from "../common/CommonConfigSidebar"

export default function Function({ func , updateFunctions}) {
    const [functionConfig, setFunctionConfig] = useState(func)
    const [showDetails, setShowDetails] = useState(false)
    const { projectName, componentName } = useParams()

    useEffect(()=>{
        setFunctionConfig(func)
    },[func])


    function updateFunctionConfig(){
        console.log('update function config')
        updateFunction(projectName,componentName,functionConfig).then(res=>{
            console.log(res)
            updateFunctions(res)
        })
    }

    return (

        <div className={" container-fluid  border p-2 " + (showDetails ? "bg-dark" : "")}>
            <div className="d-flex px-1 " style={{ cursor: 'pointer' }} onClick={() => setShowDetails(state => !state)} >
                <button className="btn p-0 m-0 shadow-none" >
                    {showDetails ?
                        <img src={downArrow} height={20} alt="" />
                        :
                        <img src={rightArrow} height={20} alt="" />
                    }
                </button>
                <div className=" fs-5 ">
                    {func.name}
                </div>
                {!showDetails&&
                    <div className=" ms-4 mt-1">
                        {func?.description ? func.description : " No description"}
                    </div>
                }
            </div>
            <CommonConfigSidebar title="Title" onClose={()=>setShowDetails(false)}>
                {showDetails &&
                    <>
                    <div className="row mx-2" >
                        <div className="col-2 ">
                            Description
                        </div>
                        <div className="col">
                            <textarea className=" w-75" value={func.description} onChange={(event)=>setFunctionConfig(state=>{return {...state,description:event.target.value}})} placeholder="Description" name="" id=""></textarea>
                        </div>
                    </div>
                    <div className="row mx-2 my-1 " >
                        <div className="col">Parameters</div>
                    </div>

                    <div className="row mx-2 " >
                        <div className="col">
                            <input type="checkbox" checked={functionConfig.isAnonymous} onChange={(event)=>setFunctionConfig(state=>{return {...state,isAnonymous:event.target.checked}})} className="my-2 me-2" />
                            Anonymous 
                        </div>
                    </div>


                    <div className="row mx-2 " >
                        <div className="col">
                            <input type="checkbox" checked={functionConfig.isAsync} onChange={(event)=>setFunctionConfig(state=>{return {...state,isAsync:event.target.checked}})}  className="my-2 me-2" />
                            Async 
                        </div>
                    </div>
                    <div className="row mx-2 mt-3">
                        <div className="col">Function Body</div>
                    </div>
                    <div id={"function-body-"+func["$id"]} className="row mx-2">
                        <MonacoEditor   
                            onChange={(body)=>setFunctionConfig((state)=>{return {...state,body}})}
                            defaultValue={func.body}
                            id={func['$id']}
                            width="90%"
                            height="200px"
                        />
                    </div>
                    <div className="row my-3">
                        <div className=" text-end">
                            <button className="btn me-4 btn-primary" onClick={updateFunctionConfig}>
                                Update
                            </button>
                        </div>
                    </div>
                </>

                }
            </CommonConfigSidebar>
            {/* {(showDetails) &&
                <>
                    <div className="row mx-2" >
                        <div className="col-2 ">
                            Description
                        </div>
                        <div className="col">
                            <textarea className=" w-75" value={func.description} onChange={(event)=>setFunctionConfig(state=>{return {...state,description:event.target.value}})} placeholder="Description" name="" id=""></textarea>
                        </div>
                    </div>
                    <div className="row mx-2 my-1 " >
                        <div className="col">Parameters</div>
                    </div>

                    <div className="row mx-2 " >
                        <div className="col">
                            <input type="checkbox" checked={functionConfig.isAnonymous} onChange={(event)=>setFunctionConfig(state=>{return {...state,isAnonymous:event.target.checked}})} className="my-2 me-2" />
                            Anonymous 
                        </div>
                    </div>


                    <div className="row mx-2 " >
                        <div className="col">
                            <input type="checkbox" checked={functionConfig.isAsync} onChange={(event)=>setFunctionConfig(state=>{return {...state,isAsync:event.target.checked}})}  className="my-2 me-2" />
                            Async 
                        </div>
                    </div>
                    <div className="row mx-2 mt-3">
                        <div className="col">Function Body</div>
                    </div>
                    <div id={"function-body-"+func["$id"]} className="row mx-2">
                        <MonacoEditor   
                            onChange={(body)=>setFunctionConfig((state)=>{return {...state,body}})}
                            defaultValue={func.body}
                            id={func['$id']}
                            width="90%"
                            height="200px"
                        />
                    </div>
                    <div className="row my-3">
                        <div className=" text-end">
                            <button className="btn me-4 btn-primary" onClick={updateFunctionConfig}>
                                Update
                            </button>
                        </div>
                    </div>
                </>

            } */}
        </div>
    )
}