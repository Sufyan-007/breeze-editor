import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { transferToAuthApi } from "../../../services/AuthApiService";
import { useParams } from "react-router";

function GeneralSettingsCard({ settings, onChange, isAuthApi, selectedServiceInfo, onSuccessfulTransfer }) {
  const [showModal, setShowModal] = useState(false);
  const handleInputChange = (prop, value) => {
    onChange(prop, value);
  };
  const {projectName}= useParams();
  console.log(settings, "settings");
  const convertToServiceApi = () => {
    // console.log("fsdfdf");
    setShowModal(!showModal);
  };
  const convertToAuthApi = async() => {
    setShowModal(!showModal);
  };
  const handleConversion = async () => {
    const payload = {
      "filename": selectedServiceInfo.filename,
      "id": selectedServiceInfo.id,
      "module_id":selectedServiceInfo.module_id
    }
    const result = await transferToAuthApi(payload, projectName);
    if(result.message){
      setShowModal(!showModal);
      onSuccessfulTransfer();
    }
  }
  return (
    <>
      <Modal show={showModal}>
        <Modal.Header className="bg-dark text-white" closeButton>
          <Modal.Title>Convert to Auth </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark text-white">
          <p>The contents of this File will be Lost!</p>
        </Modal.Body>

        <Modal.Footer className="bg-dark text-white">
          <Button variant="primary" onClick={() => setShowModal(!showModal)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleConversion}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mt-3">
        <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
          <span className="mx-2">General Settings</span>
        </div>
        <Row className="mt-2">
          <Col sm={6}>
            <Row>
              <Col sm={3}>
                <Form.Label className="text-white mx-3"> Name:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="var"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={settings.operation_id ? settings.operation_id : ""}
                  onChange={(e) =>
                    handleInputChange("operation_id", e.target.value)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={3}>
                <Form.Label className="text-white mx-3">
                  Service File:
                </Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="var"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={settings.tags ? settings.tags : ""}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col sm={6}>
            <Row>
              <Col sm={3}>
                <Form.Label className="text-white mx-3"> Summary:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="var"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={settings.summary ? settings.summary : ""}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            {isAuthApi ? <Row>
              <Col sm={3}>
                <Form.Label className="text-white mx-3">
                  Authnetication Type:
                </Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={settings.authentication_type}
                  onChange={(e) => onChange("authentication_type", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="BEARER">Bearer</option>
                  <option value="BASIC">Basic</option>
                  <option value="OAUTH2">Oauth2</option>
                  <option value="APIKEY">ApiKey</option>
                </Form.Control>
              </Col>
            </Row> :
              <Row>
                <Col sm={3}>
                  <Form.Label className="text-white mx-3">Api Type:</Form.Label>
                </Col>
                <Col sm={9}>
                  <div
                    class="btn-group"
                    role="group"
                    aria-label="Basic radio toggle button group">
                    <input
                      type="radio"
                      class="btn-check"
                      name="btnradio"
                      id="btnradio1"
                      autocomplete="off"
                      onClick={convertToServiceApi}
                      checked={!isAuthApi}
                      disabled={!isAuthApi}
                      size="sm"
                    />
                    <label class="btn btn-outline-secondary " for="btnradio1">
                      Service Api
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="btnradio"
                      id="btnradio2"
                      autocomplete="off"
                      size="sm"
                      onClick={convertToAuthApi}
                      disabled={isAuthApi}
                      checked={isAuthApi}
                    />
                    <label class="btn btn-outline-secondary " for="btnradio2">
                      Auth Api
                    </label>
                  </div>
                  {/* <Form.Check
                  className=""
                  type="checkbox"
                  checked={!settings.is_open_api}
                  onChange={(e) => onChange("is_open_api", !e.target.checked)}
                /> */}
                </Col>
              </Row>}
          </Col>
        </Row>
        {!isAuthApi ? (
          <Row className="mt-2">
            <Col sm={6}>
              <Row>
                <Col sm={3}>
                  <Form.Label className="text-white mx-3">
                    Requires Authentication ?
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Check
                    className=""
                    type="checkbox"
                    checked={!settings.is_open_api}
                    onChange={(e) => onChange("is_open_api", !e.target.checked)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={6}>
            </Col>
          </Row>
        ) : (
          <>
          </>
        )}
      </Row>
    </>
  );
}

export default GeneralSettingsCard;
