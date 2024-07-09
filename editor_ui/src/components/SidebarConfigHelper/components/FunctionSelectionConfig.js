import React, { useEffect } from "react";
import MonacoEditor from "../../common/MonacoEditor";
import { Form, Button, FormGroup } from "react-bootstrap";
import { useState } from "react";
import CollapsibleFunctionArea from "./CollapsibleFunctionArea";

const FunctionSelectionConfig = ({
  selectedAttributes,
  setSelectedAttributes,
  handleDeleteAttribute,
  availableFunctions,
}) => {
  const [functionType, setFunctionType] = useState({});

  useEffect(() => {
    const initialFunctionType = {};
    Object.keys(selectedAttributes).forEach((attribute) => {
      if (attribute.startsWith("on")) {
          
          initialFunctionType[attribute] = selectedAttributes[attribute].value
            ? "custom"
            : "predefined";

      }
    });
    setFunctionType(initialFunctionType);
    
  }, [selectedAttributes]);

  const handleFunctionTypeChange = (attribute, type) => {
    setFunctionType((prev) => ({
      ...prev,
      [attribute]: type,
    }));
  };
  const addFunctionAttribute = (functionType, value, attribute) => {
    if (functionType === "predefined") {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute]: { type: "FUNCTION", $ref: value.target.value },
      }));
    } else {
      const functionConfig = {
        parameters: { list: [{ name: "event" }] },
        isAnonymous: true,
        isAsync: false,
        functionBody: value,
      };
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute]: { type: "FUNCTION", value: functionConfig },
      }));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <div style={{ width: "100%" }}>
          {selectedAttributes &&
            Object.keys(selectedAttributes)
              .map((attribute, index) => ({ attribute, index }))
              .filter(({ attribute }) => attribute.startsWith("on"))
              .map(({ attribute, index }) => (
                <div key={index} className="mt-4 d-flex justify-content-end">
                  <CollapsibleFunctionArea title={attribute}>
                    <div className="">
                      {attribute}

                      <div
                        className="d-flex justify-content-between"
                        style={{ width: "100%" }}
                      >
                        <div>
                          {functionType[attribute]}

                          <Form.Check
                            type="radio"
                            name={`function-${attribute}`}
                            label="Predefined Function"
                            onChange={() =>
                              handleFunctionTypeChange(attribute, "predefined")
                            }
                            disabled={availableFunctions.length === 0}
                            checked={functionType[attribute] === "predefined"}
                          />
                          <Form.Check
                            type="radio"
                            name={`function-${attribute}`}
                            label="Custom Function"
                            onChange={() =>
                              handleFunctionTypeChange(attribute, "custom")
                            }
                            checked={functionType[attribute] === "custom"}
                          />
                        </div>{" "}
                        {
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            style={{ height: "2.4rem" }}
                            onClick={() => handleDeleteAttribute(attribute)}
                          >
                            <i className="bi bi-trash3 p-1"></i>
                          </Button>
                        }
                      </div>

                      <div className="mt-2">
                        {functionType[attribute] === "predefined" && (
                          <FormGroup className="w-100 d-flex align-items-center justify-content-between">
                            <Form.Label className="text-capitalize w-25">
                              {functionType[attribute]}
                            </Form.Label>
                            <Form.Select
                              style={{
                                backgroundColor: "#303033",
                                color: "white",
                              }}
                              onChange={(event) => {
                                addFunctionAttribute(
                                  "predefined",
                                  event,
                                  attribute
                                );
                              }}
                            >
                              <option value="" disabled selected hidden>
                                Select a function
                              </option>

                              {availableFunctions &&
                                availableFunctions.map((functions, index) => (
                                  <option key={index} value={functions.id}>
                                    {functions.name}
                                  </option>
                                ))}
                            </Form.Select>
                          </FormGroup>
                        )}
                        {functionType[attribute] === "custom" && (
                          <div>
                            <MonacoEditor
                              defaultValue={
                                selectedAttributes[attribute]?.value
                                  ?.functionBody || ""
                              }
                              height="200px"
                              onChange={(body) =>
                                addFunctionAttribute("custom", body, attribute)
                              }
                              id={`functionEditor-${attribute}`}
                            ></MonacoEditor>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleFunctionArea>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionSelectionConfig;
