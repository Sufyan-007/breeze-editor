import { useContext, useEffect, useState } from "react";
import { ComponentContext } from "./ComponentConfigPage";
import { useParams } from "react-router";

import TextElement from "../SidebarConfigHelper/components/TextElementConfig";
import HtmlElementConfig from "../SidebarConfigHelper/components/HtmlElementConfig";

export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig, setComponentConfig } =
    useContext(ComponentContext);
  const [selectedElem, setSelectedElement] = useState(null);
  const elem = selectedElem?.elem;
  const [textValue, setTextValue] = useState("");
  const [elemTypeValue, setElemTypeValue] = useState("");
  const { projectName, componentName } = useParams();

  useEffect(() => {
    sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
      const htmlElements = componentConfig?.html_elements;
      const idName = elem?.elem;
      setTextValue(htmlElements[idName]?.text);
      setElemTypeValue(htmlElements[idName]?.type);
    });
  }, [sidebarService]);

  const makeSelectedElementNull = () => {
    sidebarService.setSelectedElem(null);
  };
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    //
    //
  };
  const handleUpdateTextClick = () => {
    const html_config = { ...componentConfig.html_elements };

    html_config[elem].text = textValue;
    updateHtmlConfig(projectName, elem, componentName, html_config[elem]);
  };
  const handleUpdateHtmlClick = (html_config) => {
    updateHtmlConfig(projectName, elem, componentName, html_config);
  };
  //Api

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
      // Assuming `setComponentConfig` is a state setter function
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

  //APi

  if (!elem) {
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
            {elemTypeValue === "text" && (
              <TextElement
                textValue={textValue}
                handleTextChange={handleTextChange}
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateTextClick={handleUpdateTextClick}
              />
            )}
            {elemTypeValue === "Element" && (
              <HtmlElementConfig
                selectedElement={selectedElem}
                componentConfig={componentConfig}
                makeSelectedElementNull={makeSelectedElementNull}
                handleUpdateHtmlClick={handleUpdateHtmlClick}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
