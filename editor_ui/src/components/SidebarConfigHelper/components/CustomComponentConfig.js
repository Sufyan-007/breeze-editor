import React from "react";

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
  element,
  makeSelectedElementNull,
  handleUpdateClick,
  attributeOptions,
  availableAttributes,
  selectedAttributes,
  setSelectedAttributes,
  availableFunctions,
  allVariables,
}) => {
  //   const [attributeOption, setAttributeoptions] = useState([
  //     { value: "chocolate", label: "Chocolate" },
  //     { value: "strawberry", label: "Strawberry" },
  //     { value: "vanilla", label: "Vanilla" },
  //   ]);
  const handleSelectAttributeChange = (event) => {
    const selectedOption = event.value;
    const attributeOptions = Object.keys(availableAttributes)
      .filter(
        (key) =>
          !key.startsWith("on") && !selectedAttributes.hasOwnProperty(key)
      )
      .sort()
      .map((key) => ({
        value: key,
        label: key,
      }));
    let type = availableAttributes[selectedOption]?.datatype || "LITERAL";
    if (type === "STRING") type = "LITERAL";
    else if (type === "NUMBER") type = "VARIABLE";
    // let type = "LITERAL";

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
  const addFunctionAttribute = (functionType, value, attribute) => {
    if (functionType === "bindValue") {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute]: { type: "FUNCTION", $ref: value.target.value },
      }));
    } else if(functionType === "functionValue") {
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
      
      } else {
           setSelectedAttributes((prev) => ({
            ...prev,
            [attribute]: { type: "LITERAL", value: value.target.value },
           }))
      }
    
  };

  return (
    <>
      <Creatable
        options={attributeOptions}
        onChange={handleSelectAttributeChange}
        placeholder="Add Props"
        styles={{
          ...customStyles,
        }}
        // components={{
        //   DropdownIndicator: () => null,
        //   IndicatorSeparator: () => null,
        // }}
        value={null}
      />

      <div>
        {selectedAttributes &&
          Object.entries(selectedAttributes).map(([key, value]) => (
            <div className="d-flex justify-content-end mt-3" key={key}>
              <CollapsibleProp
                title={key}
                handleDeleteAttribute={handleDeleteAttribute}
                value={value}
                addFunctionAttribute={addFunctionAttribute}
                availableFunctions={availableFunctions}
                allVariables={allVariables}
              ></CollapsibleProp>
            </div>
          ))}
      </div>
    </>
  );
};

export default CustomComponentConfig;
