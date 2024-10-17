import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './toaster-styles.css';

const BreezeToaster = ({ message, type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'br-toast-success';
      case 'error':
        return 'br-toast-error';
      case 'warning':
        return 'br-toast-warning';
      default:
        return 'br-toast-info';
    }
  };

  return (
    isVisible && (
      <div className={`br-toast ${getToastClass()} p-2 rounded`}>
        <span>{message}</span>
      </div>
    )
  );
};

BreezeToaster.propTypes = {
  message: PropTypes.string.isRequired, // Message is required and must be a string
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']), // Only allow these types
  duration: PropTypes.number, // Duration should be a number
};

export default BreezeToaster;
