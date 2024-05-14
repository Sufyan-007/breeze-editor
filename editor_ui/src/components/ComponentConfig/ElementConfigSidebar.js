import { useContext, useMemo,useEffect, useState } from "react";
import { ComponentContext } from "./ComponentConfigPage";
import { useParams } from "react-router";

import TextElement from "../SidebarConfigHelper/components/TextElementConfig";
import HtmlElementConfig from "../SidebarConfigHelper/components/HtmlElementConfig";

export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig, setComponentConfig } = useContext(ComponentContext);
  console.log("sideBar",sidebarService)
  const [selectedElement, setSelectedElement] = useState(null);
  const { projectName, componentName } = useParams();
  const element = useMemo(() => componentConfig?.html_elements[selectedElement?.elem], [componentConfig, selectedElement]);

  useEffect(() => {
    sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
     
    });
  }, [sidebarService]);

  const makeSelectedElementNull = () => {
    sidebarService.setSelectedElem(null);
  };
  

  const handleUpdateClick = (html_config) => {
    updateHtmlConfig(projectName, selectedElement?.elem, componentName, html_config);
  };

  async function updateHtmlConfig(project_id, html_id, component, html_config) {
    try {
      const response = await fetch(
        "http://localhost:8000/editor/update-html-config/",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id, html_id, component, html_config }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update HTML config");
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
          className="col-1"
          style={{
            width: "30%",
            backgroundColor: "#303033",
            overflowY: "scroll",
            position: "relative",
            height: "100%",
          }}
        >
          <div>
            <button
              className="btn-close-white btn-close"
              onClick={makeSelectedElementNull}
            ></button>
            {element.type === "text" && (
              <TextElement
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
                element={element}
              />
            )}
            {element.type === "Element" && (
              <HtmlElementConfig
                element={element}
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
