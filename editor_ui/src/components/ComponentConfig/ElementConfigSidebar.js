import { useContext, useMemo, useEffect, useState } from "react";
import { ComponentContext } from "./ComponentConfigPage";
import { useParams } from "react-router";

// import TextElement from "../SidebarConfigHelper/components/TextElementConfig";
import HtmlElementConfig from "../SidebarConfigHelper/components/HtmlElementConfig";

export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig, setComponentConfig } =
    useContext(ComponentContext);
  const [selectedElement, setSelectedElement] = useState(null);
  const { projectName, componentName } = useParams();
  const element = useMemo(
    () => componentConfig?.html_elements[selectedElement?.elem],
    [componentConfig, selectedElement]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
    });
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
            width: "50%",
            backgroundColor: "#303033",
            overflowY: "scroll",
            position: "absolute",
            right: 0,
            height: "100%",
          }}
        >
          <div>
            <button
              className="btn-close-white btn-close"
              onClick={makeSelectedElementNull}
            ></button>
            {/* {element.type === "text" && (
              <TextElement
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
                element={element}
                isLoading={isLoading}
              />
            )} */}
            {element.type === "Element" && (
              <HtmlElementConfig
                element={element}
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateClick={handleUpdateClick}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
