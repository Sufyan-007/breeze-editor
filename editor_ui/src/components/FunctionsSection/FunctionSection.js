import { useContext, useState } from "react";
import { ComponentContext } from "../ComponentConfig/ComponentConfigPage";
import Function from "./Function";
import MonacoEditor from "../common/MonacoEditor";
import { addFunction as addFunctionService } from "../../services/FunctionConfigService";
import { useParams } from "react-router";
import Offcanvas from "../common/Offcanvas";
import FunctionParams from "./FunctionParams";

export default function FunctionSection() {
    const { componentConfig, setComponentConfig } = useContext(ComponentContext);
    const { projectName, componentName } = useParams();
    const functions = componentConfig.functions;

    const [newParam, setNewParam] = useState(null);
    const [newFunctionConfig, setNewFunctionConfig] = useState(null);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    const handleOpen = () => setIsOffcanvasOpen(true);
    const handleClose = () => setIsOffcanvasOpen(false);

    function updateParams(param, index) {
        setNewFunctionConfig((functionConfig) => {
          functionConfig.parameters.list[index] = param;
    
          return { ...functionConfig };
        });
    }
    function updateNewParam(param) {
        param = param.target.value.replace(/\s+/g, "");
        setNewParam(param);
      }
    
      function addParam() {
        if (newParam === null) {
          setNewParam("");
        } else {
          if (newParam !== "") {
            setNewFunctionConfig((functionConfig) => {
              functionConfig.parameters.list.push({
                name: newParam,
              });
              return functionConfig;
            });
            setNewParam(null);
          } else {
            alert("Param cannot be null");
          }
        }
      }


    function updateFunctions(func, index) {
        setComponentConfig((componentConfig) => {
            componentConfig.functions[index] = func;
            return { ...componentConfig };
        });
    }

    function addFunction() {
        console.log(newFunctionConfig);
        if (newFunctionConfig.name) {
            addFunctionService(projectName, componentName, newFunctionConfig).then(
                (res) => {
                    setComponentConfig((state) => {
                        state.functions.push(res);
                        console.log(state);
                        return { ...state };
                    });
                }
            );
            setNewFunctionConfig(null);
        } else {
            alert("Please enter a name");
        }
    }

    function openAddFunction() {
        setNewFunctionConfig({
            name: "",
            description: "",
            parameters: { list: [] },
            isAnonymous: false,
            isAsync: false,
            body: "",
        });
        handleOpen();
    }

    function updateNewFunctionConfig(key, value) {
        setNewFunctionConfig((state) => {
            return { ...state, [key]: value };
        });
    }

    return (
        <div
            className="row flex-grow-1 text-white"
            style={{ backgroundColor: "rgb(48, 48, 51)" }}
        >
            {newFunctionConfig && (
                <Offcanvas
                    isOpen={isOffcanvasOpen}
                    onClose={handleClose}
                    title="New Function"
                    width="500px"
                >
                    <>
                        <div className="row mx-2">
                            <div className="col-3">Name</div>
                            <div className="col">
                                <input
                                    value={newFunctionConfig.name}
                                    onChange={(event) =>
                                        updateNewFunctionConfig("name", event.target.value)
                                    }
                                    className=" w-75 my-2"
                                />
                            </div>
                        </div>
                        <div className="row mx-2">
                            <div className="col-3">Description</div>
                            <div className="col">
                                <textarea
                                    className=" w-75"
                                    value={newFunctionConfig.description}
                                    onChange={(event) =>
                                        updateNewFunctionConfig("description", event.target.value)
                                    }
                                    placeholder="Description"
                                    name=""
                                    id=""
                                ></textarea>
                            </div>
                        </div>
                        <div className="row mx-2 my-1 ">
                            <div className="col">
                                <div className=" d-flex">
                                    <div className=" fs-5">Parameters</div>
                                </div>

                                {newFunctionConfig.parameters.list.map((param, index) => (
                                    <div className="row">
                                        <FunctionParams
                                            param={param}
                                            setParam={(param) => updateParams(param, index)}
                                        />
                                    </div>
                                ))}
                                <div className="row">
                                    <div className=" m-1">
                                        {newParam !== null && (
                                            <input
                                                type="text"
                                                value={newParam}
                                                onChange={updateNewParam}
                                                className=" p-0 mx-2 "
                                            />
                                        )}
                                        <button
                                            className="p-1 btn btn-sm btn-secondary"
                                            onClick={addParam}
                                        >
                                            Add Param
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mx-2 ">
                            <div className="col">
                                <input
                                    type="checkbox"
                                    checked={newFunctionConfig.isAnonymous}
                                    onChange={(event) =>
                                        updateNewFunctionConfig("isAnonymous", event.target.checked)
                                    }
                                    className="my-2 me-2"
                                />
                                Anonymous
                            </div>
                        </div>

                        <div className="row mx-2 ">
                            <div className="col">
                                <input
                                    type="checkbox"
                                    checked={newFunctionConfig.isAsync}
                                    onChange={(event) =>
                                        updateNewFunctionConfig("isAsync", event.target.checked)
                                    }
                                    className="my-2 me-2"
                                />
                                Async
                            </div>
                        </div>
                        <div className="row mx-2 mt-3">
                            <div className="col">Function Body</div>
                        </div>
                        <div id={"new-function-body"} className="row mx-2">
                            <MonacoEditor
                                onChange={(body) =>
                                    setNewFunctionConfig((state) => {
                                        return { ...state, body };
                                    })
                                }
                                defaultValue={newFunctionConfig.body}
                                id="newFunc"
                                width="90%"
                                height="200px"
                            />
                        </div>
                        <div className="row my-3">
                            <div className=" text-end">
                                <button className="btn me-4 btn-secondary" onClick={addFunction}>
                                    Add Function
                                </button>
                            </div>
                        </div>
                    </>
                </Offcanvas>
            )}

            <div className="col ">
                <div className=" m-3 d-flex justify-content-between">
                    <h3>Functions</h3>
                    <button className=" btn btn-secondary" onClick={openAddFunction}>
                        Add Function
                    </button>
                </div>
                {functions?.length > 0 ? (
                    functions.map((func, index) => (
                        <div className="row mx-2 my-3">
                            <Function
                                func={func}
                                updateFunctions={(func) => updateFunctions(func, index)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="row m-3">No Functions</div>
                )}
            </div>
        </div>
    );
}
