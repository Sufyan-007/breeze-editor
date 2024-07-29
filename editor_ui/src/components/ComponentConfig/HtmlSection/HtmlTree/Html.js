import rightArrow from "../../../../assets/icons/arrow_right_icon.svg";
import downArrow from "../../../../assets/icons/arrow_down_icon.svg";
import threeDots from "../../../../assets/icons/three_dots_icon.svg";
import HtmlTree from "./HtmlTree";
import { Fragment, useContext, useEffect, useState } from "react";
import AddChildModal from "../AddChildModal";
import {
  addHtmlChild,
  removeHtmlElem,
} from "../../../../services/HtmlConfigService";
import { useParams } from "react-router";
import { ComponentContext } from "../../ComponentConfigPage";

export default function Html({ value, htmlId, reference, selectElem }) {
  const [showChild, setShowChild] = useState(false);
  const { setComponentConfig } = useContext(ComponentContext);
  const { projectName, componentName } = useParams();
  const hasChildren = value.children?.length > 0;
  const [showAdd, setShowAdd] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    var timeout;
    if (isHovered) {
      timeout = setTimeout(() => {
        setShowChild(true);
      }, 500);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isHovered]);

  function addChild(val) {
    if (val) {
      console.log(val);
      addHtmlChild(projectName, htmlId, componentName, val).then((res) => {
        console.log(res);
        setComponentConfig((state) => {
          state["html_elements"][htmlId] = res["parent_html"];
          state["html_elements"][res["new_child_id"]] = res["child_config"];
          console.log(state);
          return { ...state };
        });
        setShowChild(true);
      });
    }
    setShowAdd(false);
  }

  function toggleShowChild() {
    setShowChild((state) => !state);
  }

  function addText() {
    addChild({ elementType: "TEXT", text: "Hello World" });
    // addHtmlChild(projectName,htmlId,componentName,{elementType:"TEXT",text:"Hello World"}).then((res)=>{
    //     console.log(res)
    // })
  }

  function removeElem() {
    removeHtmlElem(projectName, componentName, htmlId).then((res) => {
      setComponentConfig(res);
    });
  }

  function handleDrop(event) {
    const data = event.dataTransfer.getData("text/plain");
    const droppedElem = JSON.parse(data);
    if (droppedElem.elementType) {
      addChild(droppedElem);
    }
  }

  return (
    <Fragment>
      <AddChildModal show={showAdd} update={addChild} />
      <div
        ref={reference}
        className=" p-0 d-flex justify-content-between "
        draggable
        onDrop={handleDrop}
        onDragEnter={() => setIsHovered(true)}
        onDragLeave={() => setIsHovered(false)}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <div className="d-flex w-100 ">
          {hasChildren ? (
            <button
              className="btn p-0 m-0 shadow-none"
              onClick={toggleShowChild}
            >
              {showChild ? (
                <img src={downArrow} height={20} alt="" />
              ) : (
                <img src={rightArrow} height={20} alt="" />
              )}
            </button>
          ) : (
            <div className="" style={{ marginLeft: "21px" }} />
          )}
          <div
            onClick={selectElem}
            className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
          >
            {value.tagName}
          </div>
          <div className=" dropdown ">
            <button className="btn p-0 mx-1" data-toggle="dropdown" aria-label="option">
              <img className=" h-75 " src={threeDots} alt="" />
            </button>
            <div
              className="dropdown-menu p-0 my-1 "
              aria-labelledby="dropdownMenuButton"
            >
              <div
                className="dropdown-item my-1  "
                onClick={() => setShowAdd(true)}
              >
                Add Child
              </div>
              <div className="dropdown-item my-1  " onClick={() => addText()}>
                Add Text
              </div>
              <div className="dropdown-item my-1  ">Move Up</div>
              <div className="dropdown-item my-1  ">Move Down</div>

              <div
                className="dropdown-item my-1 bg-danger "
                onClick={removeElem}
              >
                Remove
              </div>
            </div>
          </div>
        </div>
      </div>
      {hasChildren && showChild ? (
        <div className="col ms-2 m-0  border-start border-1 border-black ">
          {value.children.map((child, index) => (
            <HtmlTree key={index} htmlId={child["_id"]} className="row" />
          ))}
        </div>
      ) : null}
    </Fragment>
  );
}
