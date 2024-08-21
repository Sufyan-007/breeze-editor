import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import MonacoEditor from "../../../../common/MonacoEditor";
import CreatableSelect from "react-select/creatable";
import Creatable from "react-select/creatable";

const CustomPropConfig = ({
  index,
  inputField,
  selectedAttributes,
  handleAttributeChange,
  handleRemoveInputAttribute,
  availableFunctions,
  addRefToAttribute,
  attributeOptions,
  handleSelectAttributeChange,
  customStyles,
  getPropDataType,
  allVariables,
}) => {
  const [checkbox, setCheckbox] = useState(false);
  const [availableVar, setAvailablevar] = useState();
 
  useEffect(() => {
    if (
      inputField.type === "FUNCTION" &&
      inputField.$ref === undefined &&
      inputField.value !== ""
    ) {
      setCheckbox(true);
    } else if (
      inputField.type !== "FUNCTION" &&
      inputField.$ref !== undefined &&
      inputField.type !== "VARIABLE"
    ) {
      setCheckbox(true);
    } else if (
      inputField.type === "VARIABLE" &&
      inputField.$ref === undefined &&
      inputField.value !== ""
    ) {
      setCheckbox(true);
    }
  }, [inputField]);

  useEffect(() => {
    const propDataType = getPropDataType(inputField.key);

    const filteredDatatypes = allVariables.filter((item) => {
      return item.body.datatype.toUpperCase() === propDataType;
    });
    
    setAvailablevar(filteredDatatypes);
  }, [allVariables]);

  return (
    <>
      {" "}
      <div className="d-flex justify-content-between  ">
        <div style={{ width: "21%", fontSize: ".9rem" }}>
          {inputField.key === "" ? (
            <Creatable
              form="_none"
              options={attributeOptions}
              onChange={handleSelectAttributeChange}
              placeholder="Set Attribute"
              styles={{
                ...customStyles,
                valueContainer: (deafult) => {
                  return {
                    ...deafult,
                    borderColor: "rgb(73, 80, 87)",
                    backgroundColor: "#303033",
                    color: "white",
                    paddingRight: "0px",
                  };
                },

                dropdownIndicator: (styles) => ({
                  ...styles,
                  marginRight: "5px",
                  paddingLeft: "0px",
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              value={null}
            />
          ) : (
            inputField.key
          )}
        </div>

        <Form.Group
          className=""
          controlId="exampleForm.ControlInput1"
          style={{ width: "68%", marginRight: "10px" }}
        >
          {inputField.type === "VARIABLE" &&
            (checkbox === false ? (
              <Form.Select
                size="sm"
                style={{
                  borderColor: "rgb(73, 80, 87)",
                  backgroundColor: "rgb(37 39 42) ",
                  color: "white",
                }}
                onChange={(event) => {
                  addRefToAttribute(
                    "predefined",
                    event,
                    inputField.key,
                    "VARIABLE"
                  );
                }}
                value={inputField.$ref}
              >
                <option value="" disabled selected hidden>
                  Select a binding
                </option>

                {availableVar &&
                  availableVar.map((functions, index) => (
                    <option key={index} value={functions.id}>
                      {functions.name}
                    </option>
                  ))}
              </Form.Select>
            ) : (
              <div className="mb-2">
                <MonacoEditor
                  height="70px"
                  key={inputField.key}
                  id={`Variable-${inputField.key}`}
                  defaultValue={inputField?.value || ""}
                  onChange={(body) => {
                    handleAttributeChange(inputField.key, body);
                  }}
                />
              </div>
            ))}
          {inputField.type === "LITERAL" &&
            (checkbox === true ? (
              <Form.Select
                size="sm"
                style={{
                  borderColor: "rgb(73, 80, 87)",
                  backgroundColor: "rgb(37 39 42) ",
                  color: "white",
                }}
                onChange={(event) => {
                  addRefToAttribute(
                    "predefined",
                    event,
                    inputField.key,
                    "VARIABLE"
                  );
                }}
                value={inputField.$ref}
              >
                <option value="" disabled selected hidden>
                  Select a binding
                </option>

                {availableVar &&
                  availableVar.map((functions, index) => (
                    <option key={index} value={functions.id}>
                      {functions.name}
                    </option>
                  ))}
              </Form.Select>
            ) : inputField.key === "className" ? (
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
                  const valuesString = e.map((item) => item.value).join(" ");

                  handleAttributeChange(inputField.key, valuesString);
                }}
                className="mb-1"
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
            ) : (
              <Form.Control
                type="text"
                size="sm"
                value={inputField.value}
                style={{ borderColor: "rgb(73, 80, 87)" }}
                placeholder="value"
                className="bg-dark text-light "
                onChange={(e) => {
                  e.preventDefault();
                  handleAttributeChange(inputField.key, e.target.value);
                }}
              />
            ))}
          {inputField.type === "BOOLEAN" &&
            (checkbox === false ? (
              <Form.Select
                size="sm"
                onChange={(e) => {
                  handleAttributeChange(inputField.key, e.target.value);
                }}
                style={{ borderColor: "rgb(73, 80, 87)" }}
                defaultValue={true}
                value={inputField.value || "false"}
                //   value={selectedAttributes[attribute].value}
                className="bg-dark text-light "
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </Form.Select>
            ) : (
              <Form.Select
                style={{
                  backgroundColor: "rgb(37 39 42) ",
                  borderColor: "rgb(73, 80, 87)",
                  color: "white",
                }}
                onChange={(event) => {
                  addRefToAttribute(
                    "predefined",
                    event,
                    inputField.key,
                    "VARIABLE"
                  );
                }}
                value={inputField.$ref}
                size="sm"
              >
                <option value="" disabled selected hidden>
                  Select a binding
                </option>

                {availableFunctions &&
                  availableFunctions.map((functions, index) => (
                    <option key={index} value={functions.id}>
                      {functions.name}
                    </option>
                  ))}
              </Form.Select>
            ))}

          {inputField.type === "FUNCTION" && checkbox === true && (
            <div className="mb-2">
              <MonacoEditor
                defaultValue={inputField?.value?.functionBody || ""}
                key={inputField.key}
                height="150px"
                onChange={(body) => {
                  addRefToAttribute("functionValue", body, inputField.key);
                }}
                id={`functionEditor-${inputField.key}`}
              ></MonacoEditor>
            </div>
          )}
          {inputField.type === "FUNCTION" && checkbox === false && (
            <Form.Select
              size="sm"
              style={{
                backgroundColor: "rgb(37 39 42) ",
                borderColor: "rgb(73, 80, 87)",
                color: "white",
              }}
              onChange={(event) => {
                addRefToAttribute("predefined", event, inputField.key);
              }}
              value={inputField.$ref || ""}
            >
              <option value="" disabled hidden>
                Select a function
              </option>

              {availableFunctions &&
                availableFunctions.map((functions, index) => (
                  <option key={index} value={functions.id}>
                    {functions.name}
                  </option>
                ))}
            </Form.Select>
          )}
        </Form.Group>
        <div className="d-flex me-1">
          <Form.Check
            inline
            type="checkbox"
            style={{ marginRight: ".6rem" }}
            checked={checkbox}
            disabled={inputField.key === ""}
            custom
            className="attribute-config-checkbox"
            onChange={() => {
              const attributeValue = {
                value: inputField.key,
              };
              handleSelectAttributeChange(attributeValue);
              setCheckbox(!checkbox);
            }}
          />
          <div
            className=""
            style={{
              height: "2.5rem",
              border: "none",
              color: "red",
              padding: ".1rem",
            }}
            onClick={() => handleRemoveInputAttribute(index, inputField.key)}
          >
            <i className="bi bi-trash3 "></i>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomPropConfig;
