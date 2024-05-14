import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useRef, useEffect } from "react";

const TextElement = ({
  
  makeSelectedElementNull,
  handleUpdateClick,
  element
}) => {
  const textareaRef = useRef(null);
  const [elementValue, setElementValue] = useState(null);
 
  useEffect(() => {
    setElementValue(element);
  }, [element]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [element.text]);
 
  const handleTextChange = (e) => {
    console.log(elementValue)
    const newText = e.target.value;
    setElementValue({ ...elementValue, text: newText });
    
  };
  return (
    elementValue && (<>
      <Form.Control
        as="textarea"
        placeholder=""
        className="m-auto mt-4 mb-3 ps-3 pe-4 pt-3 pb-3"
        value={elementValue.text}
        onChange={handleTextChange}
        style={{
          minHeight: "150px",
          width: "95%",
          resize: "none",
          overflowY: "hidden",
        }}
        ref={textareaRef}
      />
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
            <button className="btn btn-primary" onClick={()=>handleUpdateClick(elementValue)}>
              Update
            </button>
          </div>
        </div>
      </div>
     
    </>)
  );
};

export default TextElement;
