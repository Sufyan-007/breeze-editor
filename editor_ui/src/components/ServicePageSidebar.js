import React, { useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import ServicePageSidebarCss from "../css/ServicePageSidebar.css";
import CustomPanel from "./CustomPanel";
import { fetchIntermediate } from "../services/IntermediatesService";

export default function ServicePageSidebar(props) {
  const [tagSelection, setSelection] = useState(0);
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [fetchedIntermediates, setFetchedIntermediates] = useState([]);
  const sidebarItems = [
    { id: 0, name: "Services" },
    { id: 1, name: "Upload" },
    { id: 2, name: "Authentication Config" },
  ];
  const highlightedStyle = { backgroundColor: "#303033" };

  const toggleUploadDropdown = () => {
    setUploadDropdownOpen(!uploadDropdownOpen);
  };
  const toggleServicesDropdown = async () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
    if (!servicesDropdownOpen) {
      try {
        const result = await fetchIntermediate("creator");
        setFetchedIntermediates(result.files_with_apis);
      } catch (error) {
        console.error("Error fetching intermediates:", error);
      }
    }
    console.log(fetchedIntermediates, "fetchedIntermediates");
  };

  return (
    <div
      className="col-2 p-2 bg-dark text-white "
      style={{
        transition: "width .3s",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100%", // Set height to 100% to match parent container's height
      }}>
      <div className="service-sidebar">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center py-2 px-1"
            style={
              tagSelection === item.id
                ? highlightedStyle
                : { cursor: "pointer" }
            }
            onClick={() => {
              setSelection(item.id);
              if (item.name === "Upload") {
                toggleUploadDropdown();
              } else if (item.name === "Services") {
                toggleServicesDropdown();
              }
            }}>
            {item.name === "Upload" ? (
              <Accordion className="upload-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{item.name}</Accordion.Header>
                  <Accordion.Body style={{ justifyContent: "center" }}>
                    <div>
                      <Button
                        variant="secondary"
                        className="m-2"
                        onClick={() => props.openFileInput("yaml")}>
                        Upload Yaml
                      </Button>
                      <input
                        ref={props.fileInputYAML}
                        type="file"
                        accept=".yaml, .yml"
                        hidden
                        onChange={(event) =>
                          props.fileUpload(event.target.files[0], "yaml")
                        }
                      />
                    </div>
                    <div>
                      <Button
                        variant="secondary"
                        className="m-2"
                        onClick={() => props.openFileInput("postman")}>
                        Upload Postman Collection
                      </Button>
                      <input
                        ref={props.fileInputPostman}
                        type="file"
                        accept=".json"
                        hidden
                        onChange={(event) =>
                          props.fileUpload(event.target.files[0], "postman")
                        }
                      />
                    </div>
                    <div>
                      <Button
                        variant="secondary"
                        className="m-2"
                        onClick={() => props.handleCustomButtonClick()}>
                        Custom
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) 
            : item.name === "Services" ? 
            (
              <Accordion className="upload-accordion">
                <Accordion.Item eventKey="services">
                  <Accordion.Header style={{ background: "#343a40" }}>
                    Services
                  </Accordion.Header>
                  <Accordion.Body style={{ justifyContent: "center" }}>
                    {fetchedIntermediates.map((service) => (
                      <Accordion key={service.filename}>
                        <Accordion.Item eventKey={service.filename}>
                          <Accordion.Header style={{ background: "#343a40" }}>
                            {service.filename}
                          </Accordion.Header>
                          <Accordion.Body>
                            <ul>
                              {Array.isArray(service.apis)
                                ? service.apis.map((api) => (
                                    <li key={api.operation_id}>
                                      {api.operation_id}
                                    </li>
                                  ))
                                : //auth.json's api is object
                                  Object.values(service.apis).map((api) => (
                                    <li key={api.operation_id}>
                                      {api.operation_id}
                                    </li>
                                  ))}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
              <span className="mx-2">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
