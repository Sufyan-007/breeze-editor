import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import remove from "../../assets/icons/remove.svg";
import ResponseBodyCss from "../../css/ResponseBody.css";
import CustomLayout from "../../css/CustomLayout.css";
import CustomFormGroup from "../CustomFormGroup";

let responseStatus = [
  {
    name: "S_201",
    label: "201",
    variant: "secondary",
  },
  {
    name: "S_403",
    label: "403",
    variant: "secondary",
  },
  {
    name: "S_500",
    label: "500",
    variant: "secondary",
  },
  {
    name: "S_200",
    label: "500",
    variant: "secondary",
  },
];

let contentTypes = [
  {
    name: "NONE",
    label: "None",
    variant: "secondary",
  },
  {
    name: "JSON",
    label: "Json",
    variant: "secondary",
  },
  {
    name: "TEXT",
    label: "Plain",
    variant: "secondary",
  },
  {
    name: "HTML",
    label: "Html",
    variant: "secondary",
  },
  {
    name: "XML",
    label: "Xml",
    variant: "secondary",
  },
];
function Response({ index, onChange, responseData, key, onRemove }) {
  const [response, setResponse] = useState(responseData || {});
  const onValueChange = (prop, value) => {
    console.log(prop, value, "response change ");
    let r = response;
    r[prop] = value;
    onChange(index, r);
  };

  return (
    <div className="custom-grid" key={key}>
      <div className="custom-grid-item one">
        {/* <Col sm={1}> */}
        <img
          src={remove}
          height={24}
          alt="remove"
          onClick={() => onRemove(index)}
        />
      </div>
      <div className="custon-grid-item el">
        <CustomFormGroup
          controls={[
            {
              label: "Status",
              type: "buttongroup",
              selectedButton: response["status"],
              onButtonClick: (e) => {
                onValueChange("status", e);
              },
              width: "100%",
              labelColWidth: 3,
              inputColWidth: 9,
              buttonGroupOptions: responseStatus,
              formId: "status",
            },
          ]}
          inline={true}
        />

        <CustomFormGroup
          controls={[
            {
              label: "Type",
              type: "buttongroup",
              selectedButton: response["content_type"],
              onButtonClick: (e) => {
                onValueChange("content_type", e);
              },
              width: "100%",
              labelColWidth: 3,
              inputColWidth: 9,
              buttonGroupOptions: contentTypes,
              formId: "content_type",
            },
          ]}
          inline={true}
        />

        <CustomFormGroup
          controls={[
            {
              label: "Schema:",
              type: "text",
              value: response["schema_name"] || "",
              onChange: (value) => onValueChange("schema_name", value),
              width: "100%",
              labelColWidth: 3,
              inputColWidth: 9,
            },
          ]}
          inline={false}
        />

        <CustomFormGroup
          controls={[
            {
              label: "Raw:",
              type: "text",
              value: response["raw_content"] || "",
              onChange: (value) => onValueChange("raw_content", value),
              width: "100%",
              labelColWidth: 3,
              inputColWidth: 9,
            },
          ]}
          inline={false}
        />

        <CustomFormGroup
          controls={[
            {
              label: "File:",
              type: "text",
              value: response["file"] || "",
              onChange: (value) => onValueChange("file", value),
              width: "100%",
              labelColWidth: 3,
              inputColWidth: 9,
            },
          ]}
          inline={false}
        />
      </div>
    </div>
  );
}

export default Response;
