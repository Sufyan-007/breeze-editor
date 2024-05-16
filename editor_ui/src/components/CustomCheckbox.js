import React from "react";
import CustomCheckboxCss from "../css/CustomCheckbox.css"
const CustomCheckbox = ({ checked, onChange }) => {
  return (

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
   
  );
};

export default CustomCheckbox;
