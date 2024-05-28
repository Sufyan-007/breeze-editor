import React, { useState, useEffect, useCallback } from "react";
import {
  fetchIntermediate,
  generateReactService,
  transferToAuthApi,
} from "../../services/IntermediatesService";
import {
  Table,
  Accordion,
  Button,
  Alert,
  Form,
  Modal,
  Tooltip,
  OverlayTrigger,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";
import transfer from "../../assets/icons/transfer.png";
import "../../css/ServiceList.css";
import { useParams } from "react-router";
export default function ServiceLists({
  onEditService,
  errorMessage,
  onAddService,
  uploadSuccess,
  setUpload,
}) {
  const [apiList, setApiList] = useState([]);
  const [selectdInfo, setSelectdInfo] = useState({});
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [selectedAuthenticationType, setSelectedAuthenticationType] =
    useState("");
  const appName = useParams();
  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediate(appName.projectName);
      setApiList(result["files_with_apis"]);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  }, [appName.projectName]);
  useEffect(() => {
    fetchServiceList();
  }, [fetchServiceList]);

  useEffect(() => {
    if (uploadSuccess) {
      fetchServiceList();
      setUpload(false);
    }
  }, [uploadSuccess, fetchServiceList, setUpload]);

  const generateService = async (filename) => {
    try {
      const result = await generateReactService(appName.projectName, filename);
      console.log(result, "result");
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };

  const handleEditClick = (apiInfo) => {
    onEditService(apiInfo);
  };

  const onTransfer = async () => {
    const result = await transferToAuthApi(selectdInfo, appName.projectName);
    setSelectedAuthenticationType("");
    setSelectdInfo({});
    setShowToast(true);
    if (result) {
      setError(result.message ? result.message : result.error);
      fetchServiceList();
    } else {
      setError("API call Failed!");
    }

    setShowTransferModal(false);
  };
  const onDropDownChange = (value) => {
    setSelectedAuthenticationType(value);
    setSelectdInfo((prevSelectdInfo) => ({
      ...prevSelectdInfo,
      authentication_type: value,
    }));
  };

  return (
    <div className="m-5" style={{ width: "95%" }}>
      <Button variant="secondary" onClick={onAddService} className="mb-3">
        <img
          className="mx-1"
          width="24"
          height="24"
          src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
          alt="add--v1"
        />
        <span>Add API</span>
      </Button>
      
      {apiList && apiList.length > 0 ? (
        apiList
          // .filter((service) => service.filename !== "auth")
          .map((service, index) => (
            <>
              <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 1 }}>
                <Toast
                  onClose={() => setShowToast(false)}
                  show={showToast}
                  autohide>
                  <Toast.Header>Transfer Status</Toast.Header>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>
              </ToastContainer>
              <Accordion key={index}>
                <Accordion.Item
                  eventKey={service.filename}
                  style={{ cursor: "pointer" }}>
                  <Accordion.Header>
                    {service.filename}{" "}
                    <Button
                      variant="link"
                      className="mx-1"
                      onClick={(e) => {
                        e.preventDefault();
                        generateService(service.filename);
                      }}>
                      Generate Service
                    </Button>
                  </Accordion.Header>
                  <Accordion.Body>
                    {service.apis && Object.keys(service.apis).length > 0 ? (
                      <Table striped bordered hover variant="dark">
                        <thead>
                          <tr>
                            <th colSpan={9}>Name</th>

                            <th colSpan={3}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(service.apis).map(([key, value]) => (
                            <tr key={key}>
                              <td colSpan={9}>
                                <div className="name-cell">
                                  {value.operation_id}
                                </div>
                              </td>

                              <td colSpan={3}>
                                <div className="actions-cell d-flex">
                                  <OverlayTrigger
                                    key={"edit"}
                                    placement="right"
                                    overlay={
                                      <Tooltip id={`tooltip-edit`}>
                                        {"Edit"}
                                      </Tooltip>
                                    }
                                    delay={{ show: 250, hide: 400 }}>
                                    <img
                                      className="mx-2"
                                      src={EditIcon}
                                      alt="Edit"
                                      style={{
                                        cursor: "pointer",
                                        width: "20px",
                                        height: "20px",
                                      }}
                                      onClick={() =>
                                        handleEditClick({
                                          id: value.id,
                                          filename: service.filename,
                                        })
                                      }
                                    />
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    key={"delete"}
                                    placement="right"
                                    overlay={
                                      <Tooltip id={`tooltip-delete`}>
                                        {"Delete"}
                                      </Tooltip>
                                    }
                                    delay={{ show: 250, hide: 400 }}>
                                    <img
                                      className="mx-2"
                                      src={DeleteIcon}
                                      alt="Delete"
                                      style={{
                                        cursor: "pointer",
                                        width: "20px",
                                        height: "20px",
                                      }}
                                    />
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    key={"transfer"}
                                    placement="right"
                                    overlay={
                                      <Tooltip id={`tooltip-transfer`}>
                                        {"Transfer"}
                                      </Tooltip>
                                    }
                                    delay={{ show: 250, hide: 400 }}>
                                    <img
                                      className="mx-2"
                                      src={transfer}
                                      alt="transfer"
                                      style={{
                                        cursor: "pointer",
                                        width: "20px",
                                        height: "20px",
                                      }}
                                      onClick={() => {
                                        setShowTransferModal(true);
                                        setSelectdInfo({
                                          id: value.id,
                                          filename: service.filename,
                                        });
                                      }}
                                    />
                                  </OverlayTrigger>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <h5 style={{ color: "black", textAlign: "center" }}>
                        No services found
                      </h5>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
                <Modal
                  show={showTransferModal}
                  onHide={() => {
                    setShowTransferModal(false);
                    setSelectedAuthenticationType("");
                    setSelectdInfo({});
                  }}
                  centered
                  animation>
                  <Modal.Header closeButton>
                    <Modal.Title>Select Authentication Type:</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group controlId="authenticationType">
                      <Form.Label>Select Authentication Type:</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedAuthenticationType}
                        onChange={(e) => onDropDownChange(e.target.value)}>
                        <option value="">Select</option>
                        <option value="NOAUTH">NOAUTH</option>
                        <option value="BASIC">BASIC</option>
                        <option value="OAUTH">OAUTH</option>
                        <option value="OAUTH2">OAUTH2</option>
                        <option value="BEARER">BEARER</option>
                        <option value="APIKEY">APIKEY</option>
                      </Form.Control>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    {console.log(selectedAuthenticationType, "selecteddd")}
                    {selectedAuthenticationType && (
                      <Button variant="danger" onClick={onTransfer}>
                        Transfer
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>
              </Accordion>
            </>
          ))
      ) : errorMessage ? (
        <Alert className="error-message" variant="warning">
          {errorMessage}
        </Alert>
      ) : (
        <></>
      )}
    </div>
  );
}
