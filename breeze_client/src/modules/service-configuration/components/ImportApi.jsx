import { useRef } from 'react';
import logos from '../../../assets/svgs/index';
import PropTypes from 'prop-types';
function ImportApi({ show, onClose, onImport }) {
  const postmanInputRef = useRef(null);
  const swaggerInputRef = useRef(null);
  const swaggerWebsocketInputRef = useRef(null);
  const postmanEnvInputRef = useRef(null);

  const handleInputClick = (type) => {
    if (type === 'postman') {
      postmanInputRef.current.click();
    } else if (type === 'swagger') {
      swaggerInputRef.current.click();
    } else if (type === 'swaggerWebsocket') {
      swaggerWebsocketInputRef.current.click();
    }
  };

  const handleInputChange = (event, fileType) => {
    onImport(event, fileType);
  };

  return (
    <div
      className={`modal fade ${show ? 'show' : ''}`}
      style={{ display: show ? 'block' : 'none' }}
      tabIndex="-1"
      aria-labelledby="importApiModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-0">
          <div className="modal-header br-background-primary br-text-primary">
            <h5 className="modal-title" id="importApiModalLabel">
              Import APIs
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body br-background-primary br-text-primary">
            <div className="d-flex h-100">
              <div className="d-flex flex-column align-items-center w-100" id="postman">
                <div className="mb-2">
                  <img src={logos.postmanLogo} alt="" height={50} width={50} className="p-1" />
                </div>
                <div
                  className="w-50 cursor-pointer p-1 mb-2 br-text-primary border border-dashed border-light"
                  onClick={() => handleInputClick('postman')}
                >
                  <input
                    type="file"
                    className="w-50"
                    accept=".json,.yaml"
                    ref={postmanInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleInputChange(e, 'postman')}
                  />
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/upload--v1.png"
                    alt="upload--v1"
                    className="mx-1"
                  />
                  <span className="mx-1">Postman file</span>
                </div>
                <div
                  className="w-50 cursor-pointer p-1 mb-2 br-text-primary border border-dashed border-light"
                  onClick={() => handleInputClick('postmanenv')}
                >
                  <input
                    type="file"
                    className="w-50"
                    accept=".json,.yaml"
                    ref={postmanEnvInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleInputChange(e, 'postmanenv')}
                  />
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/upload--v1.png"
                    alt="upload--v1"
                    className="mx-1"
                  />
                  <span className="mx-1">Postman .env file</span>
                </div>
              </div>
              <div className="text-white mx-3">
                <span> OR </span>
              </div>
              <div className="d-flex flex-column align-items-center w-100" id="swagger">
                <div className="mb-2">
                  <img src={logos.swaggerLogo} alt="" height={50} width={50} className="p-1" />
                </div>
                <div
                  className="w-50 cursor-pointer p-1 mb-2 br-text-primary border border-dashed border-light"
                  onClick={() => handleInputClick('swagger')}
                >
                  <input
                    type="file"
                    className="w-50"
                    accept=".yaml, .yml, .json"
                    ref={swaggerInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleInputChange(e, 'openapi')}
                  />
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/upload--v1.png"
                    alt="upload--v1"
                    className="mx-1"
                  />
                  <span className="mx-1">Swagger file</span>
                </div>
                <div
                  className="w-50 cursor-pointer p-1 mb-2 br-text-primary border border-dashed border-light"
                  onClick={() => handleInputClick('swaggerWebsocket')}
                >
                  <input
                    type="file"
                    className="w-50"
                    accept=".json,.yaml, .yml"
                    ref={swaggerWebsocketInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleInputChange(e, 'websocket')}
                  />
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/upload--v1.png"
                    alt="upload--v1"
                    className="mx-1"
                  />
                  <span className="mx-1">Swagger (websocket) file</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer br-background-primary">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
ImportApi.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};
export default ImportApi;
