import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer'
import '../display/d.display.css'

const ToasterComponent = ({showToaster, position, variant, toastTitle, toastBody, onClose, delay, autohide, closeButton=true, bodyFontColor = 'text-secondary'}) => {

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
          <Toast.Header  className="toaster-header" closeButton={ closeButton }>
            {toastTitle}
          </Toast.Header>
          <Toast.Body className={`bodyFontColor`}>{toastBody}</Toast.Body>
        </Toast>
      </ToastContainer>
  );
}

export default ToasterComponent;