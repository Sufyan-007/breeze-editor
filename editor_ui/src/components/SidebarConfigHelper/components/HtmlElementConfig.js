import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const HtmlElementConfig = ({
  element,
  makeSelectedElementNull,
  handleUpdateClick,
  isLoading,
}) => {
  const [elementValue, setElementValue] = useState(null);
  const [availableAttributes, setAvailableAttributes] = useState([
    "src",
    "img",
    "width",
    "height",
  ]);
  console.log(element);
  useEffect(() => {
    setElementValue(element);
  }, [element]);

  const updateHtmlElementConfig = (e) => {
    e.preventDefault();

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
        <Form.Group className="mb-5">
          {element.elementType === "HTML" ? (
            <label>Element</label>
          ) : element.elementType === "THIRD_PARTY" ? (
            <label>{`${
              element.library.charAt(0).toUpperCase() + element.library.slice(1)
            } Component`}</label>
          ) : element.elementType === "CUSTOM" ? (
            <label>Custom Component</label>
          ) : null}
          <Form.Control
            type="text"
            value={element.tagName}
            className="mt-2"
            readOnly
          />
        </Form.Group>

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
            {elementValue &&
              Object.keys(elementValue?.attributes).map((attribute, index) => (
                <div key={index} className="mt-4">
                  <Form.Label>{attribute}</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={elementValue.attributes[attribute].value}
                      onChange={(e) =>
                        handleAttributeChange(attribute, e.target.value)
                      }
                      disabled={attribute === "id"}
                    />
                    {attribute !== "id" && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteAttribute(index)}
                      >
                        <i className="bi bi-trash3 p-1"></i>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>styles</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Write your inline css here"
            style={{ resize: "none" }}
          />
        </Form.Group>
        <div
          className="pt-1   mt-3  w-100"
          style={{
            position: "sticky",
            bottom: "0",
            marginBottom: "0",
            backgroundColor: "#303033",
          }}
        >
          <div className="d-flex justify-content-between pb-3 pt-2">
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
                {isLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    size="sm"
                    className="mr-2"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                Update
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default HtmlElementConfig;
