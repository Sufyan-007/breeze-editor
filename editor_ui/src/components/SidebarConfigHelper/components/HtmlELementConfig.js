import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

const HtmlELementConfig = ({
  selectedElement,
  componentConfig,
  makeSelectedElementNull,
  handleUpdateHtmlClick,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedEventListeners, setSelectedEventListeners] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [eventListeners, setEventListners] = useState([
    "onClick",
    "onMousehover",
  ]);
  const [htmlELementConfig, setHtmlELementConfig] = useState(null);

  console.log("sdhys", selectedElement);
  console.log("sdkjs", componentConfig);
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const updateHtmlELementConfig = () => {
    console.log("upfate", htmlELementConfig);
    handleUpdateHtmlClick(htmlELementConfig);
  };
  useEffect(() => {
    const attributesValue =
      componentConfig.html_elements[selectedElement.elem].attributes;
    const keysArray = Object.keys(attributesValue);
    setAttributes(keysArray);
  }, []);
  useEffect(() => {
    setHtmlELementConfig({
      ...componentConfig.html_elements[selectedElement.elem],
    });
    
  }, [selectedElement, componentConfig]);

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.target.value;
    event.target.value = "Add Attributes";

    if (
      selectedOption === "Add Attributes" ||
      selectedAttributes.includes(selectedOption)
    ) {
      return;
    }

    // Add selected option to the array
    setSelectedAttributes([...selectedAttributes, selectedOption]);
  };

  const handleSelectedEventListenersChange = (event) => {
    const selectedOption = event.target.value;
    event.target.value = "Add Event Listener";

    // Prevent adding the "Attributes" option
    if (
      selectedOption === "Add Event Listener" ||
      selectedEventListeners.includes(selectedOption)
    ) {
      return;
    }

    // Add selected option to the array
    setSelectedEventListeners([...selectedEventListeners, selectedOption]);
  };
  console.log("sjd", selectedElement);
  console.log(componentConfig.html_elements[selectedElement.elem].attributes);

  const handleDeleteAttribute = (index) => {
    setSelectedAttributes((prevSelectedAttributes) =>
      prevSelectedAttributes.filter((_, i) => i !== index)
    );
  };
  const handleDeleteEventListener = (index) => {
    setSelectedEventListeners((prevSelectedEventListeners) =>
      prevSelectedEventListeners.filter((_, i) => i !== index)
    );
  };
  const handleAttributeChange = (key, value) => {
    setHtmlELementConfig((prevConfig) => ({
      ...prevConfig,
      attributes: {
        ...prevConfig.attributes,
        [key]: {
          type: "LITERAL",
          value: value,
        },
      },
    }));
  };

  return (
    <div className="mt-3 ps-4 pe-4">
      <Form onSubmit={handleFormSubmit} className="text-light">
        <Form.Group className="mb-3">
          <Form.Label>ELement</Form.Label>
          <Form.Control
            type="text"
            value={componentConfig.html_elements[selectedElement?.elem].tagName}
            readOnly={true}
            className="p-3"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            value={selectedElement?.elem}
            className="p-3"
            readOnly={true}
          />
        </Form.Group>

        <Accordion>
          <Accordion.Item eventKey="0" className="mt-5">
            <Accordion.Header>Attributes</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-4">
                {/* <Form.Label>Attributes</Form.Label> */}
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectAttributeChange}
                >
                  <option> Add Attributes</option>
                  {attributes.map((attribute, index) => (
                    <option key={index} value={attribute}>
                      {attribute}
                    </option>
                  ))}
                </Form.Select>
                <div>
                  {selectedAttributes.map((option, index) => (
                    <div key={index} className="mt-2">
                      <Form.Label>{option}</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={htmlELementConfig.attributes[option].value}
                          onChange={(e) =>
                            handleAttributeChange(option, e.target.value)
                          }
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleDeleteAttribute(index)}
                        >
                          <i class="bi bi-trash3 p-1"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="mt-5">
            <Accordion.Header>Styles</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-4">
                <Form.Label>Style</Form.Label>
                <Button variant="secondary" className="d-block">
                  Secondary
                </Button>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2" className="mt-5">
            <Accordion.Header>Event Listeners</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-4">
                <Form.Label>Event Listeners</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectedEventListenersChange}
                >
                  <option> Add Event Listener</option>
                  {eventListeners.map((eventListener, index) => (
                    <option key={index} value={eventListener}>
                      {eventListener}
                    </option>
                  ))}
                </Form.Select>
                <div>
                  {selectedEventListeners.map((option, index) => (
                    <div key={index} className="mt-2">
                      <Form.Label>{option}</Form.Label>
                      <div className="d-flex">
                        <Form.Control type="text" />
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleDeleteEventListener(index)}
                        >
                          <i class="bi bi-trash3 p-1"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
      <div
        className="pt-1  mb-0 mt-3  w-100"
        style={{
          position: "sticky",
          bottom: "0",
          marginBottom: "0",
          backgroundColor: "#303033",
        }}
      >
        <div className="d-flex justify-content-between pb-3">
          <div>
            <button
              className="btn btn-secondary"
              onClick={makeSelectedElementNull}
            >
              Cancel
            </button>
          </div>

          <div>
            <button
              className="btn btn-primary"
              onClick={updateHtmlELementConfig}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlELementConfig;
