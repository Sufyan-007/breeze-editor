import React, { useState, useEffect } from "react";
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
}) {
  const [apiList, setApiList] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    console.log("in service list");
    fetchServiceList();
  }, []);
  useEffect(() => {}, [apiList]);
  const appName = useParams();
  const fetchServiceList = async () => {
    try {
      const result = await fetchIntermediate(appName.projectName);
      setApiList(result["files_with_apis"]);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };

  const generateService = async (filename) => {
    try {
      const result = await generateReactService(appName.projectName, filename);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };

  const handleEditClick = (apiInfo) => {
    onEditService(apiInfo);
  };
  const onApiCheckBoxChange = (filename, id) => {
    setSelectedIds((prevSelectedIds) => {
      const isSelected = prevSelectedIds[filename]?.includes(id);
      const updatedIds = {
        ...prevSelectedIds,
        [filename]: isSelected
          ? prevSelectedIds[filename]?.filter((selectedId) => selectedId !== id)
          : [...(prevSelectedIds[filename] || []), id],
      };
      return updatedIds;
    });
  };

  const onTransfer = async () => {
    if(selectedIds && Object.keys(selectedIds).length > 0)
    {
        const result = await transferToAuthApi(selectedIds, appName.projectName);
        if (result.message) {
          fetchServiceList();
        }
    }
    setShowTransferModal(false);
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
      {apiList.length > 0 ? (
        apiList
          .filter((service) => service.filename !== "auth")
          .map((service, index) => (
            <>
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
                            <th colSpan={6}>Name</th>
                            <th colSpan={3}>Select</th>
                            <th colSpan={3}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(service.apis).map(([key, value]) => (
                            <tr key={key}>
                              <td colSpan={6}>
                                <div className="name-cell">
                                  {value.operation_id}
                                </div>
                              </td>
                              <td colSpan={3}>
                                <Form.Check
                                  className="mx-4"
                                  id="is-auth-api"
                                  checked={(
                                    selectedIds[service.filename] || []
                                  ).includes(value.id)}
                                  onChange={() =>
                                    onApiCheckBoxChange(
                                      service.filename,
                                      value.id
                                    )
                                  }
                                />
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
                                      onClick={() => setShowTransferModal(true)}
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
                    setSelectedIds({});
                  }}
                  centered
                  animation>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to transfer this Api to Authentication
                    Configuration?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={onTransfer}>
                      Transfer
                    </Button>
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
