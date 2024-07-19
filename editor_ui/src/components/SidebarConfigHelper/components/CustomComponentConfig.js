import React,{useState,useEffect} from "react";

import Creatable from "react-select/creatable";
import CollapsibleProp from "./CollapsiblePropConfig";
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
const CustomComponentConfig = ({
  attributeOptions,
  handleSelectAttributeChange,
  customStyles,
  selectedAttributes,
  handleAttributeChange,
  handleDeleteAttribute,
  availableFunctions,
  addRefToAttribute,
}) => {
 
  const [inputFields, setInputFields] = useState([]);
  console.log(inputFields);
  useEffect(() => {
    const fieldsArray = Object.keys(selectedAttributes).map((key) => ({
      key,
      ...selectedAttributes[key],
    }));
    console.log([...inputFields]);
    
    setInputFields([...fieldsArray]);
  }, [selectedAttributes]);

  const handleRemoveInputAttribute = (index,attribute) => {
    setInputFields(inputFields.filter((_, i) => i !== index));
    if(attribute!=="")
       handleDeleteAttribute(attribute)
   
  }

  const handleAddInput = () => {
    setInputFields([...inputFields, { key: "", type: "", value: "" }]);
  };
  
 

  return (
    <>
      

      <div>
        {
          inputFields.map((inputField, index) => (
              <CollapsibleProp
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
              ></CollapsibleProp>
          ))}
      </div>
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
    </>
  );
};

export default CustomComponentConfig;
