import React from "react";
import CustomTextAreaCss from "../css/CustomTextArea.css"

const CustomTextArea = ({ value, onChange, placeholder,width, colWidth}) => {
  return (
    <div className={`col-${colWidth}`}>
      <textarea
        className="custom-text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: width }}
      />
    </div>
  );
};

export default CustomTextArea;
