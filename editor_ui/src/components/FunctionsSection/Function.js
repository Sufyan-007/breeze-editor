import { useEffect, useState } from "react";
import MonacoEditor from "../common/MonacoEditor";
import { updateFunction } from "../../services/FunctionConfigService";
import { useParams } from "react-router";
import FunctionParams from "./FunctionParams";
import Offcanvas from "../common/Offcanvas";

export default function Function({ func, updateFunctions }) {
  const [functionConfig, setFunctionConfig] = useState(func);
  const { projectName, componentName } = useParams();
  const [newParam, setNewParam] = useState(null);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOpen = () => setIsOffcanvasOpen(true);
  const handleClose = () => setIsOffcanvasOpen(false);

  useEffect(() => {
    setFunctionConfig(func);
  }, [func]);

  function updateParams(param, index) {
    setFunctionConfig((functionConfig) => {
      functionConfig.parameters.list[index] = param;

      return { ...functionConfig };
    });
  }

  function updateFunctionConfig() {
    console.log("update function config");
    updateFunction(projectName, componentName, functionConfig).then((res) => {
      console.log(res);
      updateFunctions(res);
    });
    handleClose();
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
        setFunctionConfig((functionConfig) => {
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

  return (
    <div className={" container-fluid  border p-2 bg-dark"}>
      <div
        className="d-flex px-1 "
        style={{ cursor: "pointer" }}
        onClick={handleOpen}
      >
        <div className=" fs-5 ">{func.name}</div>
        <div className=" ms-4 mt-1">
          {func?.description ? func.description : " No description"}
        </div>
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title={func?.name || "Update Function"}
        width="500px"
      >
        <>
          <div className="row mx-2">
            <div className="col-3 fs-5">Description</div>
            <div className="col">
              <textarea
                className=" w-75"
                value={functionConfig.description}
                onChange={(event) =>
                  setFunctionConfig((state) => {
                    return { ...state, description: event.target.value };
                  })
                }
                placeholder="Description"
                name=""
                id=""
              ></textarea>
            </div>
          </div>

          <div className="row mx-2 my-2">
            <div className="col ">
              <div className="fs-5">Function Type</div>
              <div className=" ms-3">
                <input
                  type="checkbox"
                  checked={functionConfig.isAnonymous}
                  onChange={(event) =>
                    setFunctionConfig((state) => {
                      return { ...state, isAnonymous: event.target.checked };
                    })
                  }
                  className="my-2 me-2"
                />
                Anonymous
              </div>
              <div className=" ms-3">
                <input
                  type="checkbox"
                  checked={functionConfig.isAsync}
                  onChange={(event) =>
                    setFunctionConfig((state) => {
                      return { ...state, isAsync: event.target.checked };
                    })
                  }
                  className="my-2 me-2"
                />
                Async
              </div>
            </div>
          </div>

          <div className="row mx-2 my-1 ">
            <div className="col">
              <div className=" d-flex">
                <div className=" fs-5">Parameters</div>
              </div>

              {functionConfig.parameters.list.map((param, index) => (
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

          <div className="row mx-2 mt-3 fs-5">
            <div className="col">Function Body</div>
          </div>
          <div id={"function-body-" + func["$id"]} className="row mx-2">
            <MonacoEditor
              onChange={(body) =>
                setFunctionConfig((state) => {
                  return { ...state, body };
                })
              }
              defaultValue={functionConfig.body}
              id={func["$id"]}
              width="90%"
              height="200px"
            />
          </div>
          <div className="row my-3">
            <div className=" text-end">
              <button
                className="btn me-4 btn-secondary"
                onClick={updateFunctionConfig}
              >
                Update
              </button>
            </div>
          </div>
        </>
      </Offcanvas>
    </div>
  );
}
