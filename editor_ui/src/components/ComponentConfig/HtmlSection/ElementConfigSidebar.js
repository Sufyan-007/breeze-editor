import { useContext, useMemo, useEffect, useState } from "react";
import { ComponentContext } from "../ComponentConfigPage";
import { useParams } from "react-router";
import { useSelector } from 'react-redux';

import TextElement from "./SidebarConfigHelper/components/TextElementConfig";
import HtmlElementConfig from "./SidebarConfigHelper/components/HtmlElementConfig";

const getAvailableFunctions = (componentConfig) => {
  const functionsList = [];

  const { resources, propsVars } = componentConfig;
  console.log(componentConfig);
  
  const namedFunctions = resources.filter(resource => resource.type === "function");
  const propFunctions = propsVars.filter(propsVar => propsVar.body?.datatype === "function");
  const stateAsFunction = resources.filter(resource => resource.body?.datatype === "function");
  const hookFunction = resources.filter(resource => ["useMemo", "useCallback"].includes(resource.body?.type));
  // const setterFunctions = resources.filter(resource => resource.type === "stateVars")
  
  functionsList.push(...namedFunctions, ...propFunctions, ...stateAsFunction, ...hookFunction);
  
  return functionsList;
  
};

const getAllVariables = (componentConfig) => {
  const variablesList = [];

  const { resources, propsVars } = componentConfig;

  const variables = resources.filter(resource => resource?.type !== "function" && resource?.type?.datatype !== "function");
  const propVariables = propsVars.filter(propsVar => propsVar?.body?.datatype !== "function");
  
  variablesList.push(...variables,...propVariables);
  
  return variablesList;
}


export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig, setComponentConfig } = useContext(ComponentContext);
  const storeConfig = useSelector((state) => state.config);
 console.log("StoreConfig",storeConfig)
  const [selectedElement, setSelectedElement] = useState(null);
  const { projectName, componentName } = useParams();
  const element = useMemo(
    () => componentConfig?.html_elements[selectedElement?.elem],
    [componentConfig, selectedElement]
  );
  const [isLoading, setIsLoading] = useState(false);
  const availableFunctions = getAvailableFunctions(componentConfig)
  const allVariables = getAllVariables(componentConfig);
  console.log(componentConfig)
  useEffect(() => {
    const subscription =sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
    });
    return () => subscription.unsubscribe();

  }, [sidebarService]);

  const makeSelectedElementNull = () => {
    sidebarService.setSelectedElem(null);
  };

  const handleUpdateClick = (html_config) => {
    updateHtmlConfig(
      projectName,
      selectedElement?.elem,
      componentName,
      html_config
    );
  };

  async function updateHtmlConfig(project_id, html_id, component, html_config) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-html-config/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id, html_id, component, html_config }),
        }
      );

      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to update HTML config");
      } else {
        setIsLoading(false);
      }

      const responseData = await response.json();
      setComponentConfig((state) => {
        state["html_elements"][responseData["html_id"]] =
          responseData["html_config"];

        return { ...state };
      });
      //
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!selectedElement?.elem) {
    return null;
  } else {
    return (
      <>
        <div
          style={{
            width: "42rem",
            backgroundColor: "#212529",
            overflowY: "scroll",
            position: "absolute",
            right: 0,
            height: "100%",
            paddingLeft:".4rem",
            paddingRight:".4rem"

          }}
        >
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4 text-light mt-2 ps-3 pe-3">
              <div>
                <h5 className="tag-name  mt-2 text-capitalize">
                  {element.tagName}
                </h5>
              </div>
              <div>
                <button
                  className="btn-close-white btn-close ms-3 flex-grow-1"
                  aria-label="makeSelectedElementNull"
                  onClick={makeSelectedElementNull}
                ></button>
              </div>
            </div>
            {element.type === "text" && (
              <TextElement
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
                element={element}
                isLoading={isLoading}
              />
            )}
            {element.type === "Element" && (
              <HtmlElementConfig
                key={element.tagName}
                element={element}
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
                isLoading={isLoading}
                availableFunctions={availableFunctions}
                allVariables={allVariables}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
