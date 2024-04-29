import React, { useState, useEffect } from "react";
import {
  fetchIntermediate,
  fetchIntermediateFilenames,
  generateReactService,
} from "../../services/IntermediatesService";
import { Table, Accordion, Button } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";
import ServiceListCss from "../../css/ServiceList.css";

export default function ServiceLists({
  apis,
  tagsList,
  onClose,
  onEditClick,
  onApiSelect,
}) {
  const [fetchedIntermediates, setFetchedIntermediates] = useState([]);
  const [selectedApi, setSelectedApi] = useState();
  // const [files, setFiles] = useState([]);
  // const [formData, setFormData] = useState([]);

  useEffect(() => {
    setFetchedIntermediates(apis);

  }, [apis]);


  const generateService = async (filename) => {
    try {
      const result = await generateReactService("creator", filename);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };
  console.log(fetchedIntermediates,"inter files service list ");
  // console.log("FORM DATA ", formData);

  const handleEditClick = (api) => {
    console.log("selectedapi", api);
    setSelectedApi(api); //set the selected API in the state
    onEditClick(true);
    onApiSelect(api);
  };


  return (
    <div className="m-3">
      {fetchedIntermediates &&
        fetchedIntermediates.map((service, index) => (
          <Accordion key={index}>
            <Accordion.Item
              eventKey={service.filename}
              style={{ cursor: "pointer" }}
            >
              <Accordion.Header>{service.filename} <Button
                                variant="link"
                                className="mx-1"
                                onClick={() => {
                                  generateService(service.filename);
                                }}
                              >
                                Generate Service
                              </Button></Accordion.Header>
              <Accordion.Body>

                {service.apis && service.apis.length > 0 ? (
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th colSpan={9} >Name</th>
                        <th colSpan={3} >Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service.apis.map((api, apiIndex) => (
                        <tr key={`${api.operation_id}-${apiIndex}`}>
                          <td colSpan={9}>
                            <div className="name-cell">{api.operation_id}</div>
                          </td>
                          <td colSpan={3}>
                            <div className="actions-cell">
                              <img
                                className="m-1"
                                src={EditIcon}
                                alt="Edit"
                                style={{
                                  cursor: "pointer",
                                  width: "20px",
                                  height: "20px",
                                }}
                                onClick={() => handleEditClick(api)}
                              />
                              <img
                                src={DeleteIcon}
                                alt="Delete"
                                style={{
                                  cursor: "pointer",
                                  width: "20px",
                                  height: "20px",
                                }}
                              />

                              
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <h5 style={{ color: "white", textAlign: "center" }}>
                    No services found
                  </h5>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
    </div>
  );
}
