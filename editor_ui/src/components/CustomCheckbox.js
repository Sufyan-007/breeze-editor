import React from "react";

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div className="custom-grid-item nine">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
    </div>
  );
};

export default CustomCheckbox;
