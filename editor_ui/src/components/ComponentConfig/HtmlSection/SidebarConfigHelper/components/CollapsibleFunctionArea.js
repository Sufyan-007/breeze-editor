import React, { useState } from 'react';
import rightArrow from "../../../../../assets/icons/arrow_right_icon.svg";
import downArrow from "../../../../../assets/icons/arrow_down_icon.svg"; 
const CollapsibleFunctionArea = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded mb-1 " style={{width:"95%"}}>
      <div
        className="d-flex justify-content-start align-items-center p-1"
        onClick={toggleOpen}
        style={{ cursor: 'pointer' }}
      >
        <button type="button" className="btn p-0 m-0 shadow-none" onClick={toggleOpen}>
            {isOpen ? (
              <img src={downArrow} height={20} alt="Collapse" />
            ) : (
              <img src={rightArrow} height={20} alt="Expand" />
            )}
          </button>
        <span className="font-weight-bold">{title}</span>
      </div>
      {isOpen && <div className="p-2 text-light">{children}</div>}
    </div>
  );
};

export default CollapsibleFunctionArea;
