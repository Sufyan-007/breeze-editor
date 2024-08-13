import { useEffect, useState } from "react";
import Offcanvas from "../../../../../common/Offcanvas";
import FunctionCallEdit from "../../FunctionItemComponents/FunctionCallEdit";
import FunctionConfigStack from "../FunctionConfigStack";
import { useParams } from "react-router";
import { getResource } from "../../../../../../services/ComponentConfigService";

export default function FunctionCall({ config, updateParent }) {
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);
  const [conf, setConf] = useState(config);
  const [functionConfig, setFunctionConfig] = useState({});
  const { projectName, componentName } = useParams();

  useEffect(() => {
    setConf(config);
  }, [config]);

  useEffect(() => {
    if (conf?.callType === "serviceCall") {
      // fetch service details based on conf.id
    } else if (conf?.callType === "functionCall" && conf.id) {
      const payload = {
        project_id: projectName,
        component: componentName,
        resource_id: conf?.id,
      };

      getResource(payload)
        .then((response) => {
          setFunctionConfig(response);
        })
        .catch((error) => {
          console.error("Error updating order", error);
        });
    }
  }, [conf, componentName, projectName]);

  function handleOpen() {
    setOffCanvasOpen(true);
  }

  function handleClose(val) {
    if (val) {
      updateParent(val);
    }
    setOffCanvasOpen(false);
  }

  function updateParameter(value, index) {
    if (value) {
      setConf((state) => {
        state.parameters[index] = value;
        state = { ...state };
        updateParent(state);
        return state;
      });
    } else {
      setConf((state) => {
        state.parameters.splice(index, 1);
        state = { ...state };
        updateParent(state);
        return state;
      });
    }
  }
  return (
    <>
      <div className="custom-code border border-gray px-2 py-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>
              {config?.callType === "serviceCall" ? (
                <>Service Call</>
              ) : (
                <>Function Call</>
              )}{" "}
              :
            </strong>{" "}
            {(config.functions && config.functions[0].functionName) ||
              config.functionName}
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
        {config?.parameters &&
          config.parameters.map((param, index) => {
            return (
              <div>
                {param?.type === "FUNCTION" && (
                  <FunctionConfigStack
                    config={param}
                    updateParent={(val) => updateParameter(val, index)}
                  />
                )}
              </div>
            );
          })}
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Edit Function Call"}
        width="40%"
      >
        <div className="px-1 h-100 container">
          <FunctionCallEdit
            config={config}
            functionConfig={functionConfig}
            update={(val) => handleClose(val)}
          />
        </div>
      </Offcanvas>
    </>
  );
}
