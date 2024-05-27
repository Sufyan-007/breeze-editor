import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import remove from "../../assets/icons/remove.svg";
import CustomFormGroup from "../CustomFormGroup";
let paramInTypes = [
  {
    name: "PATH",
    label: "PATH",
    variant: "secondary",
  },
  {
    name: "QUERY",
    label: "QUERY",
    variant: "secondary",
  },
];
let parameterTypes = [
  {
    name: "STRING",
    label: "STRING",
    variant: "secondary",
  },
  {
    name: "INTEGER",
    label: "INTEGER",
    variant: "secondary",
  },
];

function Parameter({ index, onChange, parameterData, key, onRemove }) {
  console.log(parameterData, "data");
  const [parameter, setParameter] = useState(parameterData || {});
  const onValueChange = (prop, value) => {
    let p = parameter;
    p[prop] = value;
    onChange("parameters", index, p);
  };
  useEffect(() => {
    setParameter(parameterData);
  }, [parameterData]);

  const controls = [
    {
      label: "Name",
      type: "text",
      value: parameter ? parameter["name"] : "",
      onChange: (value) => onValueChange("name", value),

      width: "100%",
      labelColWidth: 3,
      inputColWidth: 9,
    },
    {
      label: "Description",
      type: "text",
      value: parameter ? parameter["description"] : "",
      onChange: (value) => onValueChange("description", value),

      width: "100%",
      labelColWidth: 3,
      inputColWidth: 9,
    },
    {
      type: "checkbox",

      label: "Required",
      checked: parameter["required"],
      onChange: (e) => {
        onValueChange("required", e.target.checked);
      },
      labelColWidth: 3,
      inputColWidth: 9,
    },
  ];
  return (
    <div className=" custom-grid mb-3 text-dark" key={key}>
      <div className="custom-grid-item one">
        <img
          src={remove}
          height={24}
          alt="remove"
          onClick={() => onRemove(index)}
        />
      </div>
      <div className="custom-grid-item el">
        <CustomFormGroup
          controls={[
            {
              label: "Param_In",
              type: "buttongroup",
              selectedButton: parameter["param_in"],
              onButtonClick: (e) => {
                onValueChange("param_in", e);
              },
              width: "100%",
              labelColWidth: 6,
              inputColWidth: 6,
              buttonGroupOptions: paramInTypes,
              formId: "param_in",
            },
          ]}
          inline={true}
        />

        <CustomFormGroup
          controls={[
            {
              label: "Type",
              type: "buttongroup",
              selectedButton: parameter["type"],
              onButtonClick: (e) => {
                onValueChange("type", e);
              },
              width: "100%",
              labelColWidth: 6,
              inputColWidth: 6,
              buttonGroupOptions: parameterTypes,
              formId: "type",
            },
          ]}
          inline={true}
        />

        <CustomFormGroup controls={controls} />
      </div>
    </div>
  );
}

export default Parameter;
