import React from "react";
import CustomTextFieldCss from "../css/CustomTextField.css"
import CustomLayoutCss from "../css/CustomLayout.css"

const CustomTextField = ({ value, onChange, placeholder , width }) => {

  return (
    
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="custom-input"
        style={{ width: width }}
      />

  );
};

export default CustomTextField;
