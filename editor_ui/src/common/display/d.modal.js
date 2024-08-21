import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalComponent = ({
  modalTitle,
  modalBody,
  isSubmitButtonPresent,
  submitHandler,
  showModal,
  closeVariant,
  submitVariant,
  submitText,
  handleClose
}) => {
  return (
    <div
      style={{ display: "block", position: "initial" }}
    >
     <Modal className='text-white' show={showModal} onHide={handleClose} data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p style={{whiteSpace: "pre-line"}}>{modalBody}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant={closeVariant || "secondary"} onClick={handleClose}>
            Close
          </Button>
          {isSubmitButtonPresent && (
            <Button variant={submitVariant || "primary"} onClick={submitHandler}>
              {submitText || 'Save Changes'}
            </Button>
          )}
        </Modal.Footer>
     </Modal>
    </div>
  );
};

export default ModalComponent;