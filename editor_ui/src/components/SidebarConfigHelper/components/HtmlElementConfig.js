import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import convert from "../htmlToReactAttrMap";
import { useParams } from "react-router";
import Creatable from "react-select/creatable";
import FunctionSelectionConfig from "./FunctionSelectionConfig";
import CreatableSelect from "react-select/creatable";
import CustomComponentConfig from "./CustomComponentConfig";

const customStyles = {
  control: (base) => ({
    ...base,
    // width: '50%',
    backgroundColor: "dark",
    color: "white",
  }),
  input: (base, state) => ({
    ...base,
    '[type="text"]': {
      fontFamily: "Helvetica, sans-serif !important",
      fontSize: 13,
      fontWeight: 900,
      color: "white !important",
    },
  }),
  menu: (base) => ({
    ...base,
    // width: "auto",

    backgroundColor: "white",
    color: "black",
    zIndex: "100",
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "white", // Customize placeholder color here
    };
  },
};
const HtmlElementConfig = ({
  element,
  makeSelectedElementNull,
  handleUpdateClick,
  isLoading,
  availableFunctions,
  allVariables,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const { projectName } = useParams();

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
        const convertedAttributes = {};

        for (let key in attributeList) {
          const convertedKey = convert(key);
          convertedAttributes[convertedKey] = attributeList[key];
        }
        setAvailableAttributes(convertedAttributes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const updateHtmlElementConfig = (e) => {
    e.preventDefault();
    const tempElememt = { ...element, attributes: selectedAttributes };
    handleUpdateClick(tempElememt);
  };

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.value;

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

  return (
    <div className="mt-3 ps-3 pe-3">
      <Form className="text-light">
        {element.elementType === "CUSTOM" ? (
          <CustomComponentConfig
            element={element}
            makeSelectedElementNull={makeSelectedElementNull}
            handleUpdateClick={handleUpdateClick}
            attributeOptions={attributeOptions}
            availableAttributes={availableAttributes}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
            availableFunctions={availableFunctions}
            allVariables={allVariables}
          />
        ) : (
          <>
            <Form.Group className="mb-5">
              <Creatable
                options={attributeOptions}
                onChange={handleSelectAttributeChange}
                placeholder="Add Attributes"
                styles={{
                  ...customStyles,
                }}
                // components={{
                //   DropdownIndicator: () => null,
                //   IndicatorSeparator: () => null,
                // }}
                value={null}
              />
              <div className="d-flex justify-content-end">
                <div className="w-100">
                  {selectedAttributes &&
                    Object.keys(selectedAttributes)
                      .map((attribute, index) => ({ attribute, index }))
                      .filter(({ attribute }) => !attribute.startsWith("on"))
                      .map(({ attribute, index }) => (
                        <div key={index} className="mt-4">
                          {/* <Form.Label>{attribute}</Form.Label> */}
                          <div className="d-flex">
                            {selectedAttributes &&
                              selectedAttributes[attribute] &&
                              selectedAttributes[attribute].type !==
                                "BOOLEAN" &&
                              (attribute !== "className" ? (
                                <FormGroup className="w-100 d-flex align-items-center justify-content-between">
                                  <Form.Label className="text-capitalize w-25">
                                    {attribute}
                                  </Form.Label>

                                  <Form.Control
                                    style={{
                                      width: "95%",
                                      color: "white",
                                      backgroundColor: "#303033",
                                    }}
                                    type={
                                      selectedAttributes[attribute].type ===
                                      "NUMBER"
                                        ? "number"
                                        : "text"
                                    }
                                    value={selectedAttributes[attribute].value}
                                    onChange={(e) =>
                                      handleAttributeChange(
                                        attribute,
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormGroup>
                              ) : (
                                <FormGroup className="w-100 d-flex align-items-center justify-content-between">
                                  <Form.Label className="text-capitalize w-25">
                                    {attribute}
                                  </Form.Label>

                                  <CreatableSelect
                                    isMulti
                                    form="_none"
                                    placeholder="Select className"
                                    value={
                                      selectedAttributes?.className?.value
                                        ? selectedAttributes.className.value
                                            .split(" ")
                                            .map((elem) => ({
                                              label: elem,
                                              value: elem,
                                            }))
                                        : ""
                                    }
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    onChange={(e) => {
                                      const valuesString = e
                                        .map((item) => item.value)
                                        .join(" ");

                                      handleAttributeChange(
                                        attribute,
                                        valuesString
                                      );
                                    }}
                                    styles={{
                                      container: (provided) => ({
                                        ...provided,
                                        width: "100%",
                                      }),
                                      ...customStyles,
                                      multiValue: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#0e98ba",
                                      }),
                                    }}
                                  />
                                </FormGroup>
                              ))}

                            {selectedAttributes &&
                              selectedAttributes[attribute] &&
                              selectedAttributes[attribute].type ===
                                "BOOLEAN" && (
                                <FormGroup className="w-100 d-flex align-items-center justify-content-between">
                                  <Form.Label className="text-capitalize w-25">
                                    {attribute}
                                  </Form.Label>
                                  <Form.Select
                                    onChange={(e) => {
                                      handleAttributeChange(
                                        attribute,
                                        e.target.value
                                      );
                                    }}
                                    defaultValue={true}
                                    value={selectedAttributes[attribute].value}
                                    style={{
                                      width: "95%",
                                      backgroundColor: "#303033",
                                      color: "white",
                                    }}
                                  >
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                  </Form.Select>
                                </FormGroup>
                              )}

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="ms-2"
                              style={{ height: "2.4rem" }}
                              onClick={() => handleDeleteAttribute(attribute)}
                            >
                              <i className="bi bi-trash3 p-1"></i>
                            </Button>
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
                placeholder="Add Event Listener"
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
          </>
        )}

        {/* <Form.Group className="mb-4">
          <Form.Label>styles</Form.Label>
          <Form.Control
            as="textarea"
            onChange={(e) => handleAttributeChange("style", e.target.value)}
            placeholder="Write your inline css here"
            style={{ resize: "none" }}
            disabled
          />
        </Form.Group> */}
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
