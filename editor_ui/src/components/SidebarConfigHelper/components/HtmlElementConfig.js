import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import convert from "../htmlToReactAttrMap";
import { useParams } from "react-router";


const HtmlElementConfig = ({
  element,
  makeSelectedElementNull,
  handleUpdateClick,
  isLoading,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const { projectName } = useParams();
  console.log("Project Name",projectName)

  console.log("It is the element", element);
  useEffect(() => {
    setSelectedAttributes(element.attributes);
  }, [element]);

  useEffect(() => {
    fetchData();
  }, [element]);

  const fetchData = async () => {

    try {

      const bodyData = {
        component_id: element.tagName,
        component_type: element.elementType,
        project_id:projectName,
      }

      if(element.elementType === 'THIRD_PARTY'){
          bodyData['third_party_id'] = element.library
          bodyData["component_id"]= element.typeId
        }
      const response = await fetch(
        `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/get-attributes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const attributeList = await response.json();
      setAvailableAttributes(attributeList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const updateHtmlElementConfig = (e) => {
    e.preventDefault();
    console.log("update", selectedAttributes);
    const tempElememt = { ...element, attributes: selectedAttributes };
    console.log("tempElememt", tempElememt);
    handleUpdateClick(tempElememt);
  };

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.target?.value;
    console.log("selected", selectedOption);
    if (selectedOption.startsWith("on")) {
      event.target.value = "Add Event Listener";
    } else {
      event.target.value = "Add Attributes";
    }

    if (
      selectedOption === "Add Attributes" ||
      selectedOption === "Add Event Listener" ||
      Object.keys(selectedAttributes).includes(selectedOption)
    ) {
      return;
    }

    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [selectedOption]: { type: availableAttributes[selectedOption].datatype, value: "" },
    }));
    setAvailableAttributes((prevAttributes) => {
      const updatedAttributes = { ...prevAttributes };
      delete updatedAttributes[selectedOption];
      return updatedAttributes;
    });
  };

  const handleDeleteAttribute = (attributeKey) => {
    setAvailableAttributes((prevAttributes) => {
      const updatedAttributes = { ...prevAttributes };
      updatedAttributes[attributeKey] = selectedAttributes[attributeKey].datatype;
      return updatedAttributes;
    });
    setSelectedAttributes((prevSelectedAttributes) => {
      const updatedAttributes = { ...prevSelectedAttributes };
      delete updatedAttributes[attributeKey];
      return updatedAttributes;
    });
  };

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [key]: { type: "LITERAL", value: value },
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

        <Form.Group className="mb-5">
          <Form.Select
            aria-label="Default select example"
            onChange={handleSelectAttributeChange}
          >
            <option>Add Attributes</option>
            {Object.keys(availableAttributes)
              .filter((attribute) => !attribute.startsWith("on"))
              .sort()
              .map((attribute, index) => (
                <option key={index} value={attribute}>
                  {attribute}
                </option>
              ))}
          </Form.Select>
          <div>
            {selectedAttributes &&
              Object.keys(selectedAttributes)
                .map((attribute, index) => ({ attribute, index }))
                .filter(({ attribute }) => !attribute.startsWith("on"))
                .map(({ attribute, index }) => (
                  <div key={index} className="mt-4">
                    <Form.Label>{attribute}</Form.Label>
                    <div className="d-flex">
                      {selectedAttributes &&
                        selectedAttributes[attribute] &&
                        selectedAttributes[attribute].type !== "BOOLEAN"  && (
                          
                          <Form.Control
                            type={selectedAttributes[attribute].type || "text"}
                            value={selectedAttributes[attribute].value}
                            onChange={(e) =>
                              handleAttributeChange(attribute, e.target.value)
                            }
                            disabled={attribute === "id"}
                          />
                          
                        )}

                      {selectedAttributes &&
                        selectedAttributes[attribute] &&
                        selectedAttributes[attribute].type === "BOOLEAN" && (
                          <Form.Select
                            onChange={(e) => {
                              handleAttributeChange(attribute, e.target.value);
                            }}
                            value={selectedAttributes[attribute].value}
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </Form.Select>
                        )}
                      {attribute !== "id" && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleDeleteAttribute(attribute)}
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
          <Form.Select
            aria-label="Default select example"
            onChange={handleSelectAttributeChange}
          >
            <option>Add Event Listener</option>
            {Object.keys(availableAttributes)
              .filter((attribute) => attribute.startsWith("on"))
              .sort()
              .map((attribute, index) => (
                <option key={index} value={attribute}>
                  {attribute}
                </option>
              ))}
          </Form.Select>

          <div>
            {selectedAttributes &&
              Object.keys(selectedAttributes)
                .map((attribute, index) => ({ attribute, index }))
                .filter(({ attribute }) => attribute.startsWith("on"))
                .map(({ attribute, index }) => (
                  <div key={index} className="mt-4">
                    <Form.Label>{attribute}</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={selectedAttributes.value}
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
                          onClick={() => handleDeleteAttribute(attribute)}
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
            onChange={(e) => handleAttributeChange("style", e.target.value)}
            placeholder="Write your inline css here"
            style={{ resize: "none" }}
            disabled
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
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    size="sm"
                    className="ms-3 me-3"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default HtmlElementConfig;
