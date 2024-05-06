import { useContext, useEffect, useState } from "react";
import { ComponentContext } from "./ComponentConfigPage";
import TextElement from "../SidebarConfigHelperComponents/TextELementConfig";
import HtmlELementConfig from "../SidebarConfigHelperComponents/HtmlELementConfig";

export default function ElementConfigSidebar({ config }) {
  const { sidebarService, componentConfig } = useContext(ComponentContext);
  const [selectedElem, setSelectedElement] = useState(null);
  const elem = selectedElem?.elem;
  const [textValue, setTextValue] = useState("");
  const [elemTypeValue, setElemTypeValue] = useState(""); // const update = selectedElem?.updateSub

  // const update = selectedElem?.updateSub
  // const component = selectedElem?.component

  useEffect(() => {
    sidebarService.getSelectedElem().subscribe((elem) => {
      setSelectedElement(elem);
      const htmlElements = componentConfig?.html_elements;
      console.log("sdks",htmlElements)
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
  };
  const handleUpdateClick = () => {
    console.log("handleUpdateClick");
  };

  if (!elem) {
    return null;
  } else {
    return (
      <>
        <div
          className="col-1"
          style={{ width: "30%", backgroundColor: "#303033" ,overflowY: "scroll", position: "relative" ,
          height: "100%"}}
        >
          <div >
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
            {elemTypeValue === "Element" && 
            <HtmlELementConfig
            selectedElement={selectedElem}
            componentConfig={componentConfig}

            />}
            <div className="pt-1 pb-1   w-100" style={{position:"sticky" , bottom:"0",backgroundColor:"#303033"}}>
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
                <button className="btn btn-primary" onClick={handleUpdateClick}>
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
