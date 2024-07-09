import React, { useState } from "react";
import CreateVariable from "../../FunctionItemComponents/CreateVariable";
import ConditionalBlock from "../../FunctionItemComponents/ConditionalBlock";
import FunctionCall from "../../FunctionItemComponents/FunctionCall";
import CustomCode from "../../FunctionItemComponents/CustomCode";
import Select from "react-select";

const options = [
  { value: "createVariable", label: "Create Variable" },
  { value: "conditionalBlock", label: "Conditional Block" },
  { value: "functionCall", label: "Function Call" },
  { value: "customCode", label: "Custom Code" },
];

function AddFunctionItem({onChange}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const renderComponent = () => {
    switch (selectedOption?.value) {
      case "createVariable":
        return <CreateVariable onChange={onChange} />;
      case "conditionalBlock":
        return <ConditionalBlock />;
      case "functionCall":
        return <FunctionCall />;
      case "customCode":
      return <CustomCode />
      default:
        return null;
    }
  };
  return (
    <div>
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
            backgroundColor: isFocused ? "#343a40" : "#212529",
            width: "100%",
            height: "100%",
            color: "#dee2e6bf",
            cursor: "pointer",
            border: isFocused ? "1px solid #495057" : "none",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#212529",
          }),
        }}
      />
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AddFunctionItem;
