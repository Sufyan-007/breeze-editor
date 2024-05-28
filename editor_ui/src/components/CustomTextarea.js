import React from "react";
import CustomTextAreaCss from "../css/CustomTextArea.css"

const CustomTextArea = ({ value, onChange, placeholder,width, colWidth}) => {
  return (
    
      <textarea
        className="custom-text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: width }}
      />
   
  );
};

export default CustomTextArea;
