import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import convert from "../htmlToReactAttrMap";
import { useParams } from "react-router";
import CustomComponentConfig from "./CustomComponentConfig";
import HtmlAttributeConfig from "./HtmlAttributeConfig";
const customStyles = {
  control: (base,state) => ({
    ...base,
    // width: '50%',
    backgroundColor: "#212529",
    color: "white",
    minHeight:10,
    borderColor:"rgb(73, 80, 87)",
    border: state.isFocused && "none",
    fontSize:".7rem"

    

  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    // const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isFocused ? "#4B9CD3" : null,
      color: "white",
      fontSize:".85rem",
      "&:hover": {
        backgroundColor: "#4B9CD3"
      }
    };
  },
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

    backgroundColor: "rgb(48, 48, 51)",
    color: "white",
    zIndex: "100",
    border: "2px solid rgb(100, 100, 100)",

    
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor: "#212529  !important",
    fontSize: "small"
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "white", // Customize placeholder color here
      fontSize: 14,
      
    };
  },
  dropdownIndicator: styles => ({ 
    ...styles, 
    paddingLeft:"0", 
    backgroundColor:'red'

  })
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

  // const attributeOptions = Object.keys(availableAttributes)
  //   .filter(
  //     (key) => !key.startsWith("on") && !selectedAttributes.hasOwnProperty(key)
  //   )
  //   .sort()
  //   .map((key) => ({
  //     value: key,
  //     label: key,
  //   }));
  const attributeOptions = Object.keys(availableAttributes)
  .filter(
    (key) => !selectedAttributes.hasOwnProperty(key)
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
   console.log("tempELe",tempElememt)

     handleUpdateClick(tempElememt);
  };

  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.value;

    let type = availableAttributes[selectedOption]?.datatype || "LITERAL";
    if (type === "STRING") type = "LITERAL";
    else if (type === "BOOLEAN") type = "BOOLEAN";
    else if (type==="OBJECT" || type==="ARRAY" ||  type === "" )type="VARIABLE"

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

  const handleAttributeChange = (key, value ,importType="") => {
    setSelectedAttributes((prevSelectedAttributes) => {
      const prevAttribute = prevSelectedAttributes[key];
      // if(key ==='className' && value)
      //    value= `"${value}"`
      let newType =
        prevAttribute && prevAttribute.type !== "LITERAL"
          ? prevAttribute.type
          : "LITERAL";
      if (newType === "ELEMENT" ) {
        newType = "VARIABLE"
      }
      if(importType!==""){
        return{
       ...prevSelectedAttributes,
        [key]: { type: newType, value: value, importType: importType},
      };
    }
      else{
      return {
        ...prevSelectedAttributes,
        [key]: { type: newType, value: value },
      }};
    });
  };
  const addRefToAttribute = (functionType, value, attribute,attributeType = '') => {
    if (functionType === "predefined") {
      if(attributeType === 'VARIABLE'){
        setSelectedAttributes((prev) => ({
         ...prev,
          [attribute]: { type: "VARIABLE", $ref: value.target.value  },
        }));
      }
      else{
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute]: { type: "FUNCTION", $ref: value.target.value },
      }))};
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
  const getPropDataType = (attributeType) =>{
    return availableAttributes[attributeType]?.datatype || ''
  }

  return (
    <div className="mt-3 ps-1 pe-1">
      <Form className="text-light">
        {element.elementType === "CUSTOM" ? (
          <CustomComponentConfig
            key={element.elementType} 
            attributeOptions={attributeOptions}
             handleSelectAttributeChange={handleSelectAttributeChange}
             customStyles={customStyles}
             selectedAttributes={selectedAttributes}
             handleAttributeChange={handleAttributeChange}
             handleDeleteAttribute={handleDeleteAttribute}
             availableFunctions={availableFunctions}
             addRefToAttribute={addRefToAttribute}
             getPropDataType={getPropDataType}
             allVariables={allVariables}
          />
        ) : (
          
            <HtmlAttributeConfig
             attributeOptions={attributeOptions}
             handleSelectAttributeChange={handleSelectAttributeChange}
             customStyles={customStyles}
             selectedAttributes={selectedAttributes}
             handleAttributeChange={handleAttributeChange}
             handleDeleteAttribute={handleDeleteAttribute}
             availableFunctions={availableFunctions}
             addRefToAttribute={addRefToAttribute}
             getPropDataType={getPropDataType}
             allVariables={allVariables}
            ></HtmlAttributeConfig>
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
          className="pt-1   mt-3  w-100 "
          style={{
            position: "sticky",
            bottom: "0",
            marginBottom: "0",
            backgroundColor: "#212529",
            zIndex: "5",
          }}
        >
          <div className="d-flex justify-content-between pb-3 pt-2 ">
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
