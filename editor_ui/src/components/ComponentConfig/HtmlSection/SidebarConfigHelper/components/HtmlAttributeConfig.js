import React, { useState, useEffect } from "react";
import "../../../../../css/ElementConfigSidebar.css";
import AttributesConfig from "./AttributesConfig";


const HtmlAttributeConfig = ({
  attributeOptions,
  handleSelectAttributeChange,
  customStyles,
  selectedAttributes,
  handleAttributeChange,
  handleDeleteAttribute,
  availableFunctions,
  addRefToAttribute,
  getPropDataType,
  allVariables,
}) => {
  const [inputFields, setInputFields] = useState([]);
//   const [checkboxStates, setCheckboxStates] = useState({})
  useEffect(() => {
    const fieldsArray = Object.keys(selectedAttributes).map((key) => ({
      key,
      ...selectedAttributes[key],
    }));
    const hasEmptyKeyField = inputFields.some((field) => field.key === "");

    if (hasEmptyKeyField && (Object.keys(selectedAttributes).length < Object.keys(inputFields).length)) {
      fieldsArray.push({ key: "", type: "", value: "" });
    }
    setInputFields([...fieldsArray]);
  }, [selectedAttributes]);
//   useEffect(()=>{
//     const newCheckboxStates = inputFields.reduce((acc, field) => { 
//         if (!(field.key in acc)) {
//           acc[field.key] = false;
//         }
//         return acc;
//       }, {});
//       setCheckboxStates(newCheckboxStates);
// },[inputFields])

  const handleAddInput = () => {
    setInputFields([...inputFields, { key: "", type: "", value: "" }]);
  };
  const handleRemoveInputAttribute = (index,attribute) => {
    setInputFields(inputFields.filter((_, i) => i !== index));
    if(attribute!=="")
       handleDeleteAttribute(attribute)
   
  }
  return (
    <div className="mb-4">
      {inputFields.map((inputField, index) => (
         <AttributesConfig
         index={index}
          key={inputField.key}
          inputField={inputField}
          selectedAttributes={selectedAttributes}
          handleAttributeChange={handleAttributeChange}
          handleRemoveInputAttribute={handleRemoveInputAttribute}
          availableFunctions={availableFunctions}
          addRefToAttribute={addRefToAttribute}
          attributeOptions={attributeOptions}
          handleSelectAttributeChange={handleSelectAttributeChange}
          customStyles={customStyles}
          getPropDataType={getPropDataType}
          allVariables={allVariables}
         ></AttributesConfig>
      ))}
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleAddInput}
          disabled= {Object.keys(selectedAttributes).length < Object.keys(inputFields).length}
        >
          <img
            className=""
            width="20"
            height="20"
            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
            alt="add--v1"
            style={{ cursor: "pointer" }}
          />
        </button>
      </div>
    </div>
  );
};

export default HtmlAttributeConfig;
