import React, { useState, useEffect } from "react";
import rightArrow from "../../../../../assets/icons/arrow_right_icon.svg";
import downArrow from "../../../../../assets/icons/arrow_down_icon.svg";
import { Form, FormGroup, Button } from "react-bootstrap";
import MonacoEditor from "../../../../common/MonacoEditor";

const CollapsiblePropConfig = ({
  title,
  handleDeleteAttribute,
  value,
  addFunctionAttribute,
  availableFunctions,
  allVariables,
}) => {
  console.log("value: " , value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const bindingVariable = [...availableFunctions, ...allVariables];
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (value.$ref === undefined) setSelectedOption("customValue");
    else {
      setSelectedOption("bindValue");
    }
  }, []);

  const handleRadioChange = (event) => {
   
    setSelectedOption(event.target.value);
  };

  return (
    <div className="border rounded mb-1" style={{ width: "90%" }}>
      <div
        className="d-flex justify-content-between align-items-center "
        onClick={toggleOpen}
        style={{ cursor: "pointer" }}
      >
        <div>
          <button
            type="button"
            className="btn p-0 m-0 shadow-none"
            onClick={toggleOpen}
          >
            {isOpen ? (
              <img src={downArrow} height={20} alt="Collapse" />
            ) : (
              <img src={rightArrow} height={20} alt="Expand" />
            )}
          </button>

          <span className="font-weight-bold text-light">{title}</span>
        </div>
        <Button
          variant="outline-danger"
          className="ms-2"
          style={{ border: "none" }}
          onClick={() => handleDeleteAttribute(title)}
        >
          <i className="bi bi-trash3 p-1"></i>
        </Button>
      </div>
      {isOpen && (
        <div className="p-2 text-light">
          <Form>
            <Form.Check
              type="radio"
              label="Bind"
              name="customRadio"
              value="bindValue"
              onChange={handleRadioChange}
              checked={selectedOption === "bindValue"}
            />
            <Form.Check
              type="radio"
              label="Custom Value"
              name="customRadio"
              value="customValue"
              onChange={handleRadioChange}
              checked={selectedOption === "customValue"}
            />
          </Form>

          <div>
            {selectedOption === "bindValue" && (
              <div>
                <FormGroup className="d-flex align-items-center justify-content-between">
                  <Form.Label>Bind</Form.Label>
                  <Form.Select
                    style={{
                      backgroundColor: "#303033",
                      color: "white",
                      width: "23rem",
                    }}
                    value={value.$ref}
                    onChange={(event) => {
                      addFunctionAttribute("bindValue", event, title);
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Select a binding
                    </option>

                    {bindingVariable &&
                      bindingVariable.map((variable, index) => (
                        <option key={index} value={variable.id}>
                          {variable.name}
                        </option>
                      ))}
                  </Form.Select>
                </FormGroup>
              </div>
            )}
            {selectedOption === "customValue" && (
              <div>
                {value.type === "FUNCTION" ? (
                  <MonacoEditor
                    defaultValue={value?.value?.functionBody || ""}
                    height="200px"
                    onChange={(body) =>
                      addFunctionAttribute("functionValue", body, title)
                    }
                    id={`functionEditor-${title}`}
                  ></MonacoEditor>
                ) : (
                  <FormGroup className="d-flex align-items-center justify-content-between mt-1">
                    <Form.Label> Value</Form.Label>
                    <Form.Control
                      type="text"
                      id="inputText"
                      value={value?.value || ""}
                      style={{
                        backgroundColor: "#303033",
                        color: "white",
                        width: "23rem",
                      }}
                      onChange={(e) => {

                        addFunctionAttribute("customValue", e, title);
                      }}
                    />
                  </FormGroup>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsiblePropConfig;
