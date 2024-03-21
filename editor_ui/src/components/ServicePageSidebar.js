import React, { useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import ServicePageSidebarCss from "../css/ServicePageSidebar.css";
import CustomPanel from "./CustomPanel";

export default function ServicePageSidebar(props) {
  const [tagSelection, setSelection] = useState(0);
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const sidebarItems = [
    { id: 0, name: "Services" },
    { id: 1, name: "Upload" },
    { id: 2, name: "Authentication Config" },
  ];
  const highlightedStyle = { backgroundColor: "#303033" };

  const toggleUploadDropdown = () => {
    setUploadDropdownOpen(!uploadDropdownOpen);
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
      }}
    >
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
              }
            }}
          >
            {item.name === "Upload" ? (
              <Accordion className="upload-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{item.name}</Accordion.Header>
                  <Accordion.Body style={{ justifyContent: "center" }}>
                    <div>
                      <Button
                        variant="secondary"
                        className="m-2"
                        onClick={() => props.openFileInput("yaml")}
                      >
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
                        onClick={() => props.openFileInput("postman")}
                      >
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
                        onClick={() => props.handleCustomButtonClick()}
                      >
                        Custom
                      </Button>
                    </div>
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
