import React, { useState } from "react";
import CreateVariable from "../FunctionItemComponents/CreateVariable";
import CustomCode from "../FunctionItemComponents/CustomCode";
import UpdateVariable from "../FunctionItemComponents/UpdateVariable";
import IfBlock from "../FunctionItemComponents/IfBlock";
import ReturnValue from "../FunctionItemComponents/ReturnValue";
import FunctionCall from "../FunctionItemComponents/FunctionCall";
import Select from "react-select";

const options = [
  { value: "createVariable", label: "Create Variable" },
  // { value: "updateVariable", label: "Update Variable" },
  { value: "ifBlock", label: "If Else Block" },
  { value: "customCode", label: "Custom Code" },
  { value: "return", label: "Return Value" },
  // { value: "functionCall", label: "Function Call" },
];

const templates = {
  ifBlock: {
    type: "IF_BLOCK",
    condition: {
      type: "CUSTOM",
      value: "",
    },
    bodyConfig: {
      type: "BLOCK",
      statements: [],
    },
    elseBody: {
      type: "BLOCK",
      statements: [],
    },
  },
  createVariable: {
    type: "DECLARATION",
    declarationType: "",
    varName: "",
  },
  customCode: {
    type: "CUSTOM",
    body: "",
  },
  return: {
    type: "RETURN",
    value: {},
  },
};

const statementTypes = {
  createVariable: CreateVariable,
  updateVariable: UpdateVariable,
  ifBlock: IfBlock,
  customCode: CustomCode,
  return: ReturnValue,
  functionCall: FunctionCall,
};

function AddFunctionItem({ update }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const SelectedComponent = statementTypes[selectedOption?.value];
  return (
    <div className="h-100 container px-0 d-flex flex-column">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select an option..."
        isSearchable
        styles={{
          placeholder: (base) => ({
            ...base,
            color: "#dee2e6bf",
          }),
          input: (base) => ({
            ...base,
            color: "#dee2e6bf",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#dee2e6bf",
          }),
          control: (styles) => ({
            ...styles,
            backgroundColor: "#212529",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            borderColor: "#495057",
            color: "white",
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? "#212529" : "#343a40",
            width: "100%",
            height: "100%",
            color: "#dee2e6bf",
            cursor: "pointer",
            border: isFocused ? "1px solid #495057" : "none",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#343a40",
            zIndex: "100",
          }),
        }}
      />
      <div className="row flex-grow-1 mt-3">
        {SelectedComponent ? (
          <SelectedComponent
            config={JSON.parse(
              JSON.stringify(templates[selectedOption?.value])
            )}
            update={(val) => {
              setSelectedOption(null);
              update(val);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default AddFunctionItem;
