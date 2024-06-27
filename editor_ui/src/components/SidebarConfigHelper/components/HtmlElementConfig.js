import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import convert from "../htmlToReactAttrMap";
import { useParams } from "react-router";
import Creatable from "react-select/creatable";
import FunctionSelectionConfig from "./FunctionSelectionConfig";
import CreateApp from "../../CreateApp";

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "white",
    color: "black",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    color: "black",
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "#2C3539", // Customize placeholder color here
    };
  },
};
const HtmlElementConfig = ({
  element,
  makeSelectedElementNull,
  handleUpdateClick,
  isLoading,
  availableFunctions,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const { projectName } = useParams();
  const [functionType, setFunctionType] = useState("");
  useEffect(() => {
    setSelectedAttributes(element.attributes);
  }, [element]);
  const eventListnerOptions = Object.keys(availableAttributes)
    .filter(
      (key) => key.startsWith("on") && !selectedAttributes.hasOwnProperty(key)
    )
    .sort()
    .map((key) => ({
      value: key,
      label: key,
    }));

  const attributeOptions = Object.keys(availableAttributes)
    .filter(
      (key) => !key.startsWith("on") && !selectedAttributes.hasOwnProperty(key)
    )
    .sort()
    .map((key) => ({
      value: key,
      label: key,
    }));

  useEffect(() => {
    fetchData();
  }, [element]);

  const fetchData = async () => {
    try {
      const bodyData = {
        component_id: element.tagName,
        component_type: element.elementType,
        project_id: projectName,
      };

      if (element.elementType === "THIRD_PARTY") {
        bodyData["third_party_id"] = element.library;
        bodyData["component_id"] = element.typeId;
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
        if (response.status === 404) {
          setAvailableAttributes([]);
        } else {
          throw new Error("Failed to fetch data");
        }
      } else {
        const attributeList = await response.json();
        setAvailableAttributes(attributeList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const updateHtmlElementConfig = (e) => {
    e.preventDefault();
    console.log("Updating", selectedAttributes);
    const tempElememt = { ...element, attributes: selectedAttributes };
    handleUpdateClick(tempElememt);
  };

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.value;

    // if (Object.keys(selectedAttributes).includes(selectedOption)) {
    //   return;
    // }

    let type = availableAttributes[selectedOption]?.datatype || "LITERAL";
    if (type === "STRING") type = "LITERAL";
    else if (type === "NUMBER") type = "VARIABLE";

    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [selectedOption]: {
        type: type,
        value: "",
      },
    }));
  };

  const handleDeleteAttribute = (attributeKey) => {
    setSelectedAttributes((prevSelectedAttributes) => {
      const updatedAttributes = { ...prevSelectedAttributes };
      delete updatedAttributes[attributeKey];
      return updatedAttributes;
    });
  };

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prevSelectedAttributes) => {
      const prevAttribute = prevSelectedAttributes[key];
      const newType =
        prevAttribute && prevAttribute.type !== "LITERAL"
          ? prevAttribute.type
          : "LITERAL";

      return {
        ...prevSelectedAttributes,
        [key]: { type: newType, value: value },
      };
    });
  };

  const handleFunctionTypeChange = (type) => {
    if (type === "predefined") {
      setFunctionType("predefined");
    } else {
      setFunctionType("custom");
    }
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
          <Creatable
            options={attributeOptions}
            onChange={handleSelectAttributeChange}
            placeholder="Add Attributes"
            styles={customStyles}
            value={null}
          />
          <div className="d-flex justify-content-end">
            <div style={{ width: "95%" }}>
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
                          selectedAttributes[attribute].type !== "BOOLEAN" && (
                            <Form.Control
                              type={
                                selectedAttributes[attribute].type || "text"
                              }
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
                                handleAttributeChange(
                                  attribute,
                                  e.target.value
                                );
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
          </div>
        </Form.Group>
        <Form.Group className="mb-4">
          <Creatable
            options={eventListnerOptions}
            onChange={handleSelectAttributeChange}
            placeholder="Add Attributes"
            styles={customStyles}
            value={null}
          />
          <FunctionSelectionConfig
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
            handleDeleteAttribute={handleDeleteAttribute}
            availableFunctions={availableFunctions}
          ></FunctionSelectionConfig>
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
            zIndex: "5",
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
