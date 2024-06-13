import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import "../api_client.css";
import postman from "../../../assets/icons/postman.svg";
import swagger from "../../../assets/icons/swagger.svg";
function ImportApi({ show, onClose, onImport }) {
  const postmanInputRef = useRef(null);
  const swaggerInputRef = useRef(null);
  const swaggerWebsocketInputRef = useRef(null);
  const postmanEnvInputRef = useRef(null);
  const handleInputClick = (type) => {
    if (type === "postman") {
      postmanInputRef.current.click();
    } else if (type === "swagger") {
      swaggerInputRef.current.click();
    } else if (type === "swaggerWebsocket") {
      swaggerWebsocketInputRef.current.click();
    }
  };
  const handleInputChange = (event, fileType) => {
    onImport(event, fileType);
  };
  return (
    <Modal size="lg" centered show={show}>
      <Modal.Header className="api-client-bg-dark">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="api-client-color-white">
          Import Apis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="api-client-bg-dark">
        <div>
          <div className="api-client-d-flex api-client-h-full">
            <div className="api-client-align-center api-client-d-flex-column api-client-w-full" id="postman">
              <div className="api-client-icon mb-2">
                <img
                  src={postman}
                  alt=""
                  height={50}
                  width={50}
                  className="p-1"
                />
              </div>
              <div
                className="api-client-w-50 api-client-cursor-pointer p-1 mb-2 api-client-color-white api-client-dashed-border"
                onClick={() => handleInputClick("postman")}>
                <input
                  type="file"
                  className="api-client-w-50 api-client-cursor-pointer"
                  accept=".json,.yaml"
                  ref={postmanInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleInputChange(e, "postman")}
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
                className="api-client-w-50 api-client-cursor-pointer p-1 mb-2 api-client-color-white api-client-dashed-border"
                onClick={() => handleInputClick("postmanenv")}>
                <input
                  type="file"
                  className="api-client-w-50 api-client-cursor-pointer"
                  accept=".json,.yaml"
                  ref={postmanEnvInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleInputChange(e, "postmanenv")}
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
            <div className="api-client-divider api-client-color-white">
              <span> OR </span>
            </div>
            <div className="api-client-align-center api-client-d-flex-column api-client-w-full" id="swagger">
              <div className="api-client-icon mb-2">
                <img
                  src={swagger}
                  alt=""
                  height={50}
                  width={50}
                  className="p-1"
                />
              </div>

              <div
                className="api-client-w-50 api-client-cursor-pointer p-1 mb-2 api-client-color-white api-client-dashed-border"
                onClick={() => handleInputClick("swagger")}>
                <input
                  type="file"
                  className="api-client-w-50 api-client-cursor-pointer"
                  accept=".yaml, .yml"
                  ref={swaggerInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleInputChange(e, "openapi")}
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
                className="api-client-w-50 api-client-cursor-pointer p-1 mb-2 api-client-color-white api-client-dashed-border"
                onClick={() => handleInputClick("swaggerWebsocket")}>
                <input
                  type="file"
                  className="api-client-w-50 api-client-cursor-pointer"
                  accept=".json,.yaml"
                  ref={swaggerWebsocketInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleInputChange(e, "websocket")}
                />
                <img
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/upload--v1.png"
                  alt="upload--v1"
                  className="mx-1"
                />
                <span className="mx-1 ">Swagger (websocket) file</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="api-client-bg-dark">
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImportApi;
