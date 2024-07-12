import React from 'react';
import PropTypes from 'prop-types';

const Offcanvas = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width, 
  height,
  margin
}) => {
  return (
    <div 
      className={`offcanvas ${isOpen ? 'show' : ''} offcanvas-end`} 
      style={{
        visibility: isOpen ? 'visible' : 'hidden',
        width: width,
        height: height,
        margin: margin,
      }} 
      tabIndex="-1"
      data-bs-theme="dark"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">{title}</h5>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body px-3 py-1">
        {children}
      </div>
      {/* <div className="offcanvas-footer p-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
      </div> */}
    </div>
  );
};

Offcanvas.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  margin: PropTypes.string,
};

Offcanvas.defaultProps = {
  width: '400px',
  height: '100vh',
  margin : '0px'
};

export default Offcanvas;
