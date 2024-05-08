import { useContext, useEffect, useState } from "react";
import { ComponentContext } from "./ComponentConfigPage";
import { useParams } from "react-router";

import TextElement from "../SidebarConfigHelper/components/TextELementConfig";
import HtmlELementConfig from "../SidebarConfigHelper/components/HtmlELementConfig";

export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig ,setComponentConfig} = useContext(ComponentContext);
  const [selectedElem, setSelectedElement] = useState(null);
  const elem = selectedElem?.elem;
  const [textValue, setTextValue] = useState("");
  const [elemTypeValue, setElemTypeValue] = useState(""); // const update = selectedElem?.updateSub
  const { projectName, componentName } = useParams();

  // const update = selectedElem?.updateSub
  // const component = selectedElem?.component

  useEffect(() => {
    sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
      const htmlElements = componentConfig?.html_elements;
      console.log("sdks", elem);
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
    // console.log(projectName,componentName)
    // console.log(elem)
    console.log(componentConfig);
  };
  const handleUpdateClick = () => {
    console.log("handleUpdateClick");
    console.log("kjfvnjdf",componentConfig.html_elements);
    console.log("sdclkdfcdfvdf",selectedElem)
    const html_config= componentConfig.html_elements;
    console.log("sdk",html_config)
    //html_config[elem].text=textValue
    console.log(  html_config[elem].text    )
    console.log(html_config)
    console.log(componentConfig)
    console.log("elem hai ye",elem)

   // updateHtmlConfig(projectName, elem, componentName, html_config);
  };

  //Api

  async function updateHtmlConfig(project_id, html_id, component, html_config) {
    const response = await (
      await fetch("http://localhost:8000/editor/update-html-config/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id, html_id, component, html_config }),
      })
    ).json();
    console.log("response",response)
    setComponentConfig(response)
    console.log("com", componentConfig);
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
              />
            )}
            {elemTypeValue === "Element" && (
              <HtmlELementConfig
                selectedElement={selectedElem}
                componentConfig={componentConfig}
              />
            )}
            <div
              className="pt-1 pb-1   w-100"
              style={{
                position: "sticky",
                bottom: "0",
                backgroundColor: "#303033",
              }}
            >
              <div className="d-flex justify-content-between  ps-3 pe-3">
                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={makeSelectedElementNull}
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateClick}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
