import React, { useState } from "react";
import CreateVariable from "../../FunctionItemComponents/CreateVariable";
import CustomCode from "../../FunctionItemComponents/CustomCode";
import UpdateVariable from "../../FunctionItemComponents/UpdateVariable";
import Select from "react-select";
import IfBlock from "../../FunctionItemComponents/IfBlock";
import ReturnValue from "../../FunctionItemComponents/ReturnValue";

const options = [
  { value: "createVariable", label: "Create Variable" },
  { value: "updateVariable", label: "Update Variable" },
  { value: "ifBlock", label: "If Else Block" },
  { value: "customCode", label: "Custom Code" },
  { value: "return", label: "Return Value" },
];

function AddFunctionItem({ onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const renderComponent = () => {
    switch (selectedOption?.value) {
      case "createVariable":
        return <CreateVariable onChange={onChange} />;
      case "updateVariable":
        return <UpdateVariable onChange={onChange} />;
      case "ifBlock":
        return <IfBlock onChange={onChange} />;
      case "customCode":
        return <CustomCode onChange={onChange} />;
      case "return":
        return <ReturnValue onChange={onChange} />;
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
      <div>{renderComponent()}</div>
    </div>
  );
}

export default AddFunctionItem;
