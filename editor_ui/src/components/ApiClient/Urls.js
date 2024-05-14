import React from "react";
import { Col, Form, FormGroup, Row } from "react-bootstrap";
import CustomFormGroup from "../CustomFormGroup";
import UrlsCss from "../../css/Urls.css";
function Urls({ urlData, onChange }) {
  // console.log(urlData, "urldata");
  const onValueChange = (field, fieldValue) => {
    const updatedUrlData = {
      ...urlData,
      [field]: fieldValue,
    };
    onChange(updatedUrlData);
  };

  const urlFields = [
    {
      id: "host",
      label: "Host",
      value: urlData ? urlData.host : [],
      onChange: (value) => onValueChange("host", value),
      placeholder: "Enter host",
      type: "text",
      width: "50%",
      inputColWidth: 9,
    },
    {
      id: "protocol",
      label: "Protocol",
      value: urlData ? urlData.protocol : "",
      onChange: (value) => onValueChange("protocol", value),
      placeholder: "Enter protocol",
      type: "text",
      inputColWidth: 9,
      width: "50%",
    },
    {
      id: "port",
      label: "Port",
      value: urlData ? urlData.port : "",
      onChange: (value) => onValueChange("port", value),
      placeholder: "Enter port",
      type: "text",
      inputColWidth: 9,
      width: "50%",
    },
    {
      id: "path",
      label: "Path",
      value: urlData ? urlData.path : [],
      onChange: (value) => onValueChange("path", value),
      placeholder: "Enter path",
      type: "text",
      inputColWidth: 9,
      width: "80%",
    },
    {
      id: "baseurl",
      label: "Base URL",
      value: urlData ? urlData.baseurl : "",
      onChange: (value) => onValueChange("baseurl", value),
      placeholder: "Enter base URL",
      type: "text",
      inputColWidth: 9,
      width: "100%",
    },
  ];

  return <CustomFormGroup controls={urlFields} inline={true} />;
}

export default Urls;
