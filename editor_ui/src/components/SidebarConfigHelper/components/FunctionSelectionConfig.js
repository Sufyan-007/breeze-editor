import React from "react";
import MonacoEditor from "../../common/MonacoEditor";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";

const FunctionSelectionConfig = ({
  selectedAttributes,
  setSelectedAttributes,
  handleDeleteAttribute,
  availableFunctions,
}) => {
  const [functionType, setFunctionType] = useState({});

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
        "parameters": { "list": [{name:"event"}] },
        "isAnonymous": true,
        "isAsync": false,
        "body": value,
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
        <div style={{ width: "95%" }}>
          {selectedAttributes &&
            Object.keys(selectedAttributes)
              .map((attribute, index) => ({ attribute, index }))
              .filter(({ attribute }) => attribute.startsWith("on"))
              .map(({ attribute, index }) => (
                <div key={index} className="mt-4">
                  <div className="">
                    {attribute}

                    <div
                      className="d-flex justify-content-between"
                      style={{ width: "95%" }}
                    >
                      <div>
                        <Form.Check
                          type="radio"
                          name={`function-${attribute}`}
                          label="Predefined Function"
                          onChange={() =>
                            handleFunctionTypeChange(attribute, "predefined")
                          }
                          disabled={availableFunctions === undefined}
                        />
                        <Form.Check
                          type="radio"
                          name={`function-${attribute}`}
                          label="Custom Function"
                          onChange={() =>
                            handleFunctionTypeChange(attribute, "custom")
                          }
                        />
                      </div>{" "}
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

                    <div className="mt-2">
                      {functionType[attribute]}
                      {functionType[attribute] === "predefined" && (
                        <Form.Select
                          onChange={(event) =>
                            addFunctionAttribute("predefined", event, attribute)
                          }
                        >
                          {availableFunctions &&
                            availableFunctions.map((functions, index) => (
                              <option key={index} value={functions.id}>
                                {functions.name}
                              </option>
                            ))}
                        </Form.Select>
                      )}
                      {functionType[attribute] === "custom" && (
                        <div>
                          <MonacoEditor
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
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionSelectionConfig;
