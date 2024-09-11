import PropTypes from 'prop-types';
import './BreezeModal.css';

const CustomModal = ({ isOpen, onClose, header, footer, size = 'lg', children }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal modal-${size} fade show`} style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content p-1">
          {/* Header */}
          {header && (
            <div className="modal-header rounded custom-modal-header br-background-primary justify-content-between">
              <h5 className="modal-title modal-med-font fw-semibold">{header.title || 'Modal Title'}</h5>
              <button
                type="button"
                className="btn modal-btn-theme modal-custom-btn px-0"
                onClick={onClose}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          )}

          {/* Body */}
          <div className="modal-body custom-modal-body">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer custom-modal-footer">
              {footer.buttons &&
                footer.buttons.map((button, index) => (
                  <button
                    key={index}
                    type={button.type || 'button'}
                    className={button.className || 'btn btn-filled modal-med-font'}
                    onClick={button.onClick}
                  >
                    {button.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.shape({
    title: PropTypes.string.isRequired,
    showCloseButton: PropTypes.bool,
  }),
  footer: PropTypes.shape({
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        type: PropTypes.string,
        className: PropTypes.string,
      })
    ),
  }),
  size: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CustomModal;
