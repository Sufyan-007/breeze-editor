import PropTypes from 'prop-types';
import './BreezeOffcanvas.css';

const BreezeOffCanvas = ({
  show,
  onClose,
  title = 'Breeze Off-canvas',
  children,
  placement = 'start',
  backdrop = true,
  size = '50%',
}) => {
  return (
    <>
      {/* Off-canvas Element */}
      <div
        className={`br-offcanvas br-background-primary br-text-tertiary offcanvas offcanvas-${placement} ${show ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: show ? 'visible' : 'hidden', width: `${size}` }}
        aria-labelledby="offcanvasLabel"
        aria-hidden={!show}
        role="dialog"
      >
        {/* Header */}
        <div className="offcanvas-header justify-content-between">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            {title}
          </h5>
          <button
            type="button"
            className="btn modal-btn-theme modal-custom-btn px-0"
            onClick={onClose}
            aria-label="Close"
            style={{ cursor: 'pointer' }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className={`offcanvas-body`}>{children}</div>
      </div>

      {/* Backdrop */}
      {backdrop && show && <div className="modal-backdrop fade show" onClick={onClose}></div>}
    </>
  );
};

// PropTypes validation
BreezeOffCanvas.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  placement: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
  backdrop: PropTypes.bool,
  keyboard: PropTypes.bool,
  scroll: PropTypes.bool,
  size: PropTypes.string,
};

export default BreezeOffCanvas;
