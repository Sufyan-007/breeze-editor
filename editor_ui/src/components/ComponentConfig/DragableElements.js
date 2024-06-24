import { useContext, useEffect, useRef } from "react";
import { DragContext } from "./HtmlSection";

export function DragableElements({ elem }) {
  const ref = useRef();

  const { messageListener } = useContext(DragContext);

  // useEffect(() => {
  //     const detectDrag = (event) => {
  //         console.log(event)
  //         messageListener.setSelectedElement(elem)
  //     }
  //     ref.current.addEventListener("dragstart", detectDrag)

  //     // return ()=>{
  //     //     ref.current.removeEventListener("dragstart",detectDrag)
  //     // }
  // }, [ref])

  return (
    <div
      ref={ref}
      draggable
      onDragStart={(event) => {
        // console.log(event)
        event.dataTransfer.setData("text/plain", JSON.stringify(elem));
        // // messageListener.setSelectedElement(elem)
      }}
      style={{
        cursor: "pointer",
      }}
    >
      {elem.component.name}
    </div>
  );
}
