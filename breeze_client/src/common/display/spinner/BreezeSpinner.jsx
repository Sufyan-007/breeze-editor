import PropTypes from 'prop-types';
import './BreezeSpinner.css';

const BreezeSpinner = ({
  show,
  animation = 'border', 
  color = 'primary', 
  size = 'md', 
  message = '', 
  role = 'status',
  ariaHidden = true,
}) => {
  return (
    <>
      {show && (
        <div className="d-flex flex-column align-items-center">
          <div
            className={`spinner-${animation} text-${color} ${size === 'sm' ? 'spinner-border-sm' : ''}`}
            role={role}
            aria-hidden={ariaHidden}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          {message && <p className="spinner-message">{message}</p>}
        </div>
      )}
    </>
  );
};

BreezeSpinner.propTypes = {
  show: PropTypes.bool.isRequired, 
  animation: PropTypes.oneOf(['border', 'grow']), 
  color: PropTypes.string, 
  size: PropTypes.oneOf(['sm', 'md']),
  message: PropTypes.string, 
  role: PropTypes.string, 
  ariaHidden: PropTypes.bool, 
};

export default BreezeSpinner;
