import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import MonacoEditor from "../../../../common/MonacoEditor";
import CreatableSelect from "react-select/creatable";
import Creatable from "react-select/creatable";
import { getComponents } from "../../../../../services/ComponentReadService";
import { useParams } from "react-router-dom"; // If using React Router
import Select from "react-select";

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
  const { projectName } = useParams();
  const [availableComponents, setAvailablecomponents] = useState([]);
  console.log(inputField)
  // useEffect(()=>{
  //   setSelectedComponent({  value:inputField?.value  ,
  //     label: inputField?.value ,
  //     description: inputField?.importType,})
  // },[inputField.value,inputField.importType])
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
      inputField.value !== "" &&
      inputField.importType === undefined
    ) {
      setCheckbox(true);
    } else if ( inputField.importType) {
      setCheckbox(true);
    }
    else if(inputField.value!=='' && inputField.$ref === undefined)
      setCheckbox(true);

  }, [inputField]);
  
  // useEffect(() => {
  //   const propDataType = getPropDataType(inputField.key);
  //   const filteredDatatypes = allVariables.filter((item) => {
  //     return item.body.datatype.toUpperCase() === propDataType;
  //   });

  //   setAvailablevar(filteredDatatypes);
  // }, []);
  useEffect(() => {
    const propDataType = getPropDataType(inputField.key)|| "STRING";
    let filteredDatatypes = [];
    if(propDataType==="ANY")
       filteredDatatypes=[...allVariables,...availableFunctions]
    else{
     filteredDatatypes = allVariables.filter((item) => {
      return item.body.datatype.toUpperCase() === propDataType;
    });}
    setAvailablevar(filteredDatatypes);
  }, [allVariables, checkbox, getPropDataType]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { CUSTOM, THIRD_PARTY } = await getComponents(projectName);
        let allCustomTags = CUSTOM.map((obj) => {
          obj.type = "CUSTOM";
          return obj;
        });

        let allThirdPartyTags = [];
        for (const [key, value] of Object.entries(THIRD_PARTY)) {
          allThirdPartyTags.push(
            ...value.map((obj) => {
              obj.type = "THIRD_PARTY";
              obj.libraryName = key;
              return obj;
            })
          );
        }
        const options = [...allCustomTags, ...allThirdPartyTags].map(
          (item) => ({
            value: item.name,
            label: item.name,
            description: item.type.toLowerCase(),
          })
        );

        setAvailablecomponents(options);
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    if (inputField.type === "COMPONENT" || inputField.importType !== undefined) {
      fetchData();}
  }, [inputField.type]);
  useEffect(() => {
    if (
      (inputField.type === "COMPONENT" || inputField.type === "ELEMENT") &&
      checkbox === true
    )
    console.log("Checkbox")
      // handleAttributeChange(inputField.key, "");
      
  }, [checkbox]);
 

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
                    backgroundColor: "#212529 !important",
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
          {" "}
          {(inputField.type === "COMPONENT" ||
            inputField.importType !== undefined) &&
            (checkbox === true ? (
              <>
              <Form.Select
                size="sm"
                style={{
                  borderColor: "rgb(73, 80, 87)",
                  backgroundColor: "rgb(37 39 42) ",
                  color: "white",
                }}
                value={inputField?.value}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  const selectedComponent = availableComponents.find(
                  (component) => component.value === selectedValue
                );
               
                handleAttributeChange(inputField.key, selectedComponent.value, selectedComponent.description);
            
                }}
              >
                <option value="" disabled selected hidden>
                  Select a component
                </option>

                {availableComponents &&
                  availableComponents.map((component, index) => (
                    <option key={index} value={component.value}>
                      {component.value} - {"   "}({component.description})
                    </option>
                  ))}
              </Form.Select>
             
              </>
            ) : (
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
            ))}
          {inputField.type === "ELEMENT" || inputField.type ==="ANY" && (
             (checkbox===true?(
              <MonacoEditor
             defaultValue={inputField?.value || ""}
             height="75px"
            
             onChange={(body) => {
               handleAttributeChange(inputField.key, body);
             }}
             id={`Boolean-${inputField.key}`}
             placeholderText="To denote expressions, use curly braces {}"

           ></MonacoEditor>
            ):(
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
            ))
             
          )}

          {inputField.type === "VARIABLE" &&
            inputField.importType === undefined &&
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
          {inputField.type === "NUMERIC" && (
            (checkbox===true?(
              <MonacoEditor
             defaultValue={inputField?.value || ""}
             height="75px"
            
             onChange={(body) => {
               handleAttributeChange(inputField.key, body);
             }}
             id={`Boolean-${inputField.key}`}
             placeholderText="Enter a Numeric Value"
           ></MonacoEditor>
            ):(
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
            ))
             
          )}

          {inputField.type === "LITERAL" &&
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
                  valueContainer: (provided) => ({
                    ...provided,
                    fontSize: "small ", // Adjust font size to be smaller
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#0e98ba",
                  }),
                }}
              />
            ) : (
              // <Form.Control
              //   type="text"
              //   size="sm"
              //   value={inputField.value}
              //   style={{ borderColor: "rgb(73, 80, 87)" }}
              //   placeholder="value"
              //   className="bg-dark text-light "
              //   onChange={(e) => {
              //     e.preventDefault();
              //     handleAttributeChange(inputField.key, e.target.value);
              //   }}

              // />
              <div className="mb-2">

              <MonacoEditor
              defaultValue={inputField?.value || ""}
              height="75px"
             
              onChange={(body) => {
                handleAttributeChange(inputField.key, body);
              }}
              placeholderText="To denote expressions, use curly braces {}"

              id={`Boolean-${inputField.key}`}
            ></MonacoEditor>
              </div>  
            ))}
          {inputField.type === "BOOLEAN" &&
            (checkbox === false ? (
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

              {availableVar &&
                availableVar.map((boolRef, index) => (
                  <option key={index} value={boolRef.id}>
                    {boolRef.name}
                  </option>
                ))}
            </Form.Select>
              
            ) : (
                         <div className="mb-2">

              <MonacoEditor
              defaultValue={inputField?.value || ""}
              height="75px"
             
              onChange={(body) => {
                handleAttributeChange(inputField.key, body);
              }}
              id={`Boolean-${inputField.key}`}
              placeholderText="Enter a boolean value or boolean expression"
            ></MonacoEditor>
            </div>
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
        <div className="checkbox-container" title="Checkbox Tooltip"> 

          <Form.Check
            inline
            type="checkbox"
            style={{ marginRight: ".6rem" }}
            checked={checkbox}
            disabled={inputField.key === ""}
            className="attribute-config-checkbox"
            onChange={() => {
              const attributeValue = {
                value: inputField.key,
              };
              handleSelectAttributeChange(attributeValue);
              setCheckbox(!checkbox);
            }}
          />
          </div>
          <div
            className=""
            style={{
              height: "2.5rem",
              border: "none",
              color: "red",
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
