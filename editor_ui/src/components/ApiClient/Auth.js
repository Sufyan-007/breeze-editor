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

  //   const handleAuthContentChange = (contentIndex, property, value) => {
  //     let updatedAuth = authData;
  //     updatedAuth.content[contentIndex][property] = value;
  //     setAuthData(updatedAuth);
  //     onChange(updatedAuth);
  //   };

  //   const addAuthContent = (index) => {
  //     let updatedAuth = authData;
  //     updatedAuth.content.push({ key: "", value: "", type: "" });
  //     setAuthData(updatedAuth);
  //     onChange(updatedAuth);
  //   };

  //   const removeAuthContent = (index, contentIndex) => {
  //     let updatedAuth = authData;
  //     updatedAuth.content.splice(contentIndex, 1);
  //     setAuthData(updatedAuth);
  //     onChange(updatedAuth);
  //   };

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

      {/* <Form.Group className=" mb-3 custom-form-group" controlId="token_api">
        <Row>
          <Col sm={3}>
            <Form.Label>Token Api</Form.Label>
          </Col>
          <Col sm={9}>
            <Dropdown
              onSelect={(api) => handleAuthApiSelect(api, "token_api")}
              className="m-2"
            >
              <Dropdown.Toggle variant="secondary" id="loginApiDropdown">
                {authData["token_api"]
                  ? tokenApis.find((api) => api.id === authData["token_api"])
                      .operation_id
                  : "Select Token Api"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ textAlign: "center" }}>
                {tokenApis &&
                  tokenApis.map((api) => (
                    <Dropdown.Item
                      key={api.id}
                      eventKey={api.id}
                      className="dropdownitem"
                    >
                      {api.operation_id}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Form.Group> */}

      {/* <Form.Group>
        {auth.content &&
          auth.content.map((authContent, contentIndex) => {
            <>
              <div key={contentIndex} className="d-flex mb-2">
                <Form.Control
                  style={{
                    maxWidth: "13vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="Key"
                  value={authContent[0]?.key}
                  onChange={(e) =>
                    handleAuthContentChange(contentIndex, "key", e.target.value)
                  }
                  className="mx-5 me-2"
                />
                <Form.Control
                  style={{
                    maxWidth: "13vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="Value"
                  value={authContent[1]?.value}
                  onChange={(e) =>
                    handleAuthContentChange(
                      contentIndex,
                      "value",
                      e.target.value
                    )
                  }
                  className="mx-5 me-2"
                />

                <Form.Control
                  style={{
                    maxWidth: "13vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="Type"
                  value={authContent[2]?.type}
                  onChange={(e) =>
                    handleAuthContentChange(
                      contentIndex,
                      "type",
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="secondary"
                  className="mx-5 ms-2"
                  onClick={() => removeAuthContent(index, contentIndex)}
                >
                  Remove
                </Button>
              </div>
              <Button
                variant="secondary"
                className="mx-5 mt-2"
                onClick={() => addAuthContent(contentIndex)}
              >
                Add AuthContent
              </Button>
            </>;
          })}
      </Form.Group> */}
    </div>
  );
}
