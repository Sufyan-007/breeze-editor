import React, { useState, useEffect } from "react";
import { Form, Button, Accordion } from "react-bootstrap";

const HtmlElementConfig = ({
  element,
  makeSelectedElementNull,
  handleUpdateClick,
}) => {
  const [elementValue, setElementValue] = useState(null);
  const [availableAttributes, setAvailableAttributes] = useState([
    "src",
    "img",
    "width",
    "height",
  ]);
  useEffect(() => {
    setElementValue(element);
  }, [element]);

  const updateHtmlElementConfig = () => {
    console.log("selectedAttributes", elementValue);

    handleUpdateClick(elementValue);
  };

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.target?.value;
    event.target.value = "Add Attributes";

    if (
      selectedOption === "Add Attributes" ||
      Object.keys(elementValue.attributes).includes(selectedOption)
    ) {
      return;
    }
    setElementValue((prevElementValue) => ({
      ...prevElementValue,
      attributes: {
        ...prevElementValue.attributes,
        [selectedOption]: { type: "LITERAL", value: "" },
      },
    }));
  };

  const handleDeleteAttribute = (index) => {
    setElementValue((prevElementValue) => {
      const updatedAttributes = { ...prevElementValue.attributes };
      const attributeKeys = Object.keys(updatedAttributes);
      const deletedAttributeKey = attributeKeys[index];
      delete updatedAttributes[deletedAttributeKey];
      return {
        ...prevElementValue,
        attributes: updatedAttributes,
      };
    });
  };

  const handleAttributeChange = (key, value) => {
    console.log(elementValue);
    setElementValue((prevElementValue) => ({
      ...prevElementValue,
      attributes: {
        ...prevElementValue.attributes,
        [key]: { type: "LITERAL", value: value },
      },
    }));
  };

  return (
    <div className="mt-3 ps-4 pe-4">
      <Form className="text-light">
        <Form.Group className="mb-3">
          <Form.Label>Element</Form.Label>
          <Form.Control
            type="text"
            value={element.tagName}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            value={element.attributes.id.value}
            readOnly
          />
        </Form.Group>

        <Accordion>
          <Accordion.Item eventKey="0" className="mt-5">
            <Accordion.Header>Attributes</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-4">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectAttributeChange}
                >
                  <option>Add Attributes</option>
                  {availableAttributes.map((attribute, index) => (
                    <option key={index} value={attribute}>
                      {attribute}
                    </option>
                  ))}
                </Form.Select>
                <div>
                  { elementValue && Object.keys(elementValue?.attributes).map(
                    (attribute, index) => (
                      <div key={index} className="mt-2">
                        <Form.Label>{attribute}</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value={elementValue.attributes[attribute].value}
                            onChange={(e) =>
                              handleAttributeChange(attribute, e.target.value)
                            }
                            disabled={attribute === 'id'}
                          />
                          {attribute !== 'id' && (<Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteAttribute(index)}
                          >
                            <i className="bi bi-trash3 p-1"></i>
                          </Button>)}
                          
                        </div>
                      </div>
                    )
                  )}

                 
                </div>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="mt-5">
            <Accordion.Header>Styles</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-4">
                <Button variant="secondary" className="d-block">
                  Secondary
                </Button>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          {/* <Accordion.Item eventKey="2" className="mt-5">
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
          </Accordion.Item> */}
        </Accordion>
      </Form>
      <div
        className="pt-1   mt-3  w-100"
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
              onClick={updateHtmlElementConfig}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlElementConfig;
