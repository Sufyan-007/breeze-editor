import React, { useState } from "react";
import { Form,  Row, Col, Dropdown } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import context from "react-bootstrap/esm/AccordionContext";
import CustomFormGroup from "../CustomFormGroup";
import CustomDropdown from "../CustomDropdown";
import remove from "../../assets/icons/remove.svg";
let authTypes = [
  {
    name: "NOAUTH",
    label: "No Auth",
    variant: "secondary",
  },
  {
    name: "BASIC",
    label: "Basic",
    variant: "secondary",
  },
  {
    name: "OAUTH2",
    label: "Oauth2",
    variant: "secondary",
  },
  {
    name: "BEARER",
    label: "Bearer",
    variant: "secondary",
  },
];

export default function Auth({ index, onChange, auth,onRemove, loginApis, tokenApis }) {
  const [authData, setAuthData] = useState(auth || {});

  const onValueChange = (prop, value) => {
    console.log(prop, value, "auth type in auth");
    let au = authData;
    au[prop] = value;
    setAuthData({
      ...au,
    });
    onChange("auth", index, authData);
  };
  const handleAuthApiSelect = (api, prop) => {
    console.log(api , prop, "in auth");
    let au = authData;
    au[prop] = api;
    setAuthData({
      ...au,
    });
    onChange("auth", index, authData);
  };

    const handleRemoveAuth = () => {
      console.log(index, "index in body");
      onRemove(index);
    };

  
  return (
    <div className="d-flex custom-grid body">
      <div className="custom-grid-item one">
        <img src={remove} height={24} alt="remove" onClick={handleRemoveAuth} />
      </div>
     
      <CustomFormGroup
        controls={[
          {
            label: "Type",
            type: "buttongroup",
            selectedButton: auth["type"],
            onButtonClick: (e) => {
              onValueChange("type", e);
            },
            width: "90%",
            labelColWidth: 3,
            inputColWidth: 9,
            buttonGroupOptions: authTypes,
            formId: "type",
          },
        ]}
        inline={true}
      />
    

      <CustomFormGroup
        controls={[
          {
            label: "Login Api",
            type: "dropdown",
            value: "",
            onSelect: (api) => {
              handleAuthApiSelect(api, "login_api");
            },
            width: "90%",
            labelColWidth: 3,
            inputColWidth: 9,
            dropdownOptions: loginApis,
          },
        ]}
        inline={true}
      />

      <CustomFormGroup
        controls={[
          {
            label: "Token Api",
            type: "dropdown",
            value: "",
            onSelect: (api) => {
              handleAuthApiSelect(api, "token_api");
            },
            width: "90%",
            labelColWidth: 3,
            inputColWidth: 9,
            dropdownOptions: loginApis,
          },
        ]}
        inline={true}
      />

      
    </div>
  );
}
