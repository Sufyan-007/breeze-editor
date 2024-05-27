import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import remove from "../../assets/icons/remove.svg";
import BodyCss from "../../css/Body.css"
import CustomLayoutCss from "../../css/CustomLayout.css";
import CustomFormGroup from "../CustomFormGroup";
const modeOptions = [
  { name: "RAW", label: "Raw", variant: "secondary" },
  { name: "FORMDATA", label: "Formdata", variant: "secondary" },
  { name: "URLENCODED", label: "Urlencoded", variant: "secondary" },
  { name: "FILE", label: "File", variant: "secondary" },
];

const contentTypes = [
  { name: "NONE", label: "None", variant: "secondary" },
  { name: "JSON", label: "Json", variant: "secondary" },
  { name: "TEXT", label: "Text", variant: "secondary" },
  { name: "HTML", label: "Html", variant: "secondary" },
  { name: "XML", label: "Xml", variant: "secondary" },
];

const Body = ({ index, onChange, bodyData, onRemove, key }) => {
  const [body, setBody] = useState(bodyData || {});

  const onValueChange = (prop, value) => {
    const updatedBody = { ...body, [prop]: value };
    setBody(updatedBody);
    onChange("body", index, updatedBody);
  };

  const handleRemoveBody = () => {
    console.log(index, "index in body");
    onRemove(index);
  };

  return (
    <div key={key} className="custom-grid body">
      <div className="custom-grid-item one">
        <img src={remove} height={24} alt="remove" onClick={handleRemoveBody} />
      </div>
      <div className="custom-grid-item el">
          <CustomFormGroup
            controls={[
              {
                label: "Mode",
                type: "buttongroup",
                selectedButton: body["mode"],
                onButtonClick: (e) => {
                  onValueChange("mode",e);
                },
                width: "100%",
                labelColWidth: 3,
                inputColWidth: 9,
                buttonGroupOptions: modeOptions,
                formId: "mode",
              },
            ]}
            inline={true}
          />
          {body.mode === "RAW" && (
            <>         
              <CustomFormGroup
                controls={[
                  {
                    label: "Type",
                    type: "buttongroup",
                    selectedButton: body["content_type"],
                    onButtonClick: (e) => {
                      onValueChange("content_type",e);
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
                    value:body["schema_name"] || "",
                    onChange:(value) =>
                      onValueChange("schema_name", value)
                    ,
                    width: "100%",
                    labelColWidth: 3,
                    inputColWidth: 9,
                  },
                ]}
                inline={true}
              />
            </>
          )}
      
      </div>
    </div>
  );
};

export default Body;
