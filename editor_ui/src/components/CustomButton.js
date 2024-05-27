import React from "react";
import PropTypes from "prop-types";

const CustomButton = ({ border, color ,textColor ,height, width, label, onClick }) => {

  return (
    <div className="button-wrapper" onClick={onClick}>
      <button
      className={`custom-button ${label}`}
        style={{
          backgroundColor: color,
          color: textColor,
          border,
          height,
          width,
        }}
      >
        {label}
      </button>
    </div>
  );
};
CustomButton.propTypes = {
  border: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.any,
};

CustomButton.defaultProps = {
  border: "1px solid white",
  textColor: "white",
  color: "#007bff",
  height: "auto",
  width: "auto",
  active: true,
};

export default CustomButton;
