import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer'

const ToasterComponent = ({showToaster, position, variant, toastTitle, toastBody, onClose, delay, autohide, closeButton}) => {

  return (
      <ToastContainer
        className="p-3"
        position={position || 'top-end'}
      >
        <Toast 
            onClose={onClose} 
            show={showToaster} 
            delay={delay || 5000} 
            autohide={autohide || true}
            bg={variant || 'secondary'} // should be in complete lowercase
        >
          <Toast.Header  closeButton={ closeButton ? true : false}>
            {toastTitle}
          </Toast.Header>
          <Toast.Body className={variant === 'Dark' && 'text-white'}>{toastBody}</Toast.Body>
        </Toast>
      </ToastContainer>
  );
}

export default ToasterComponent;