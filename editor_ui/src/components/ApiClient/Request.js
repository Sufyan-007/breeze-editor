import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Auth from "./Auth.js";
import Urls from "./Urls.js";
import Parameter from "./Parameter.js"
import add from "../../assets/icons/add.svg";
import CustomButtonGroup from "../CustomButtonGroup.js";
import  "../../css/RequestBody.css";
import  "../../css/CustomLayout.css";
import CustomFormGroup from "../CustomFormGroup.js";

let methodType = [
  {
    name: "GET",
    label: "GET",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "POST",
    label: "POST",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "PUT",
    label: "PUT",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "DELETE",
    label: "DELETE",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
];
function Request({ loginApis, tokenApis, onChange, requestBody , renderAuth}) {
  // console.log(loginApis, tokenApis, "login token");
  const [request, setRequest] = useState(requestBody || {});
  useEffect(()=>{setRequest(requestBody)},[requestBody])
  const onUrlValueChange = (value) => {
    console.log(value, "onurlchange");
    let r = request;
    r["url"] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };
  const onListValueChange = (prop, index, data) => {
    let r = request;
    r[prop][index] = data;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };

  const onValueChange = (prop, value) => {
    // console.log(prop, value ,"see for method value change ");
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };
  const addProperty = (name, initial_values) => {
    const newProperty = {
      ...initial_values,
      id: Date.now(),
    };
    console.log(newProperty, "newprop");
    setRequest({
      ...request,
      [name]: request[name] ? [...request[name], newProperty] : [newProperty],
    });
    onChange("request", request);
  };
  // const addBodySection = () => {
  //   const newBody = {
  //     id: Date.now(),
  //     mode: "RAW",
  //     content_type: "NONE",
  //     schema_name: "",
  //     anonymous: false,
  //   };
  //   setRequest({
  //     ...request,
  //     body: request.body ? [...request.body, newBody] : [newBody],
  //   });

  //   setHasBody(true);
  // };
  useEffect(() => {
    if (request.body && request.body.length > 0) {
      const updatedBody = request.body.map((body) => ({
        ...body,
        id: Date.now() + Math.random(),
      }));
      setRequest((prevState) => ({
        ...prevState,
        body: updatedBody,
      }));
    }
  }, []);
  // const removeBodySection = (indexToRemove) => {
  //   if (request.body && request.body.length > 0) {
  //     const updatedBody = request.body.filter(
  //       (_, index) => index !== indexToRemove
  //     );
  //     const updatedRequest = {
  //       ...request,
  //       body: updatedBody,
  //     };
  //     setRequest(updatedRequest);
  //     onChange("request", updatedRequest);
  //     setHasBody(updatedBody.length > 0);
  //   }
  // };
    const removeProperty = (name, indexToRemove) => {
      if (request[name] && request[name].length > 0) {
        const updatedProperty = request[name].filter(
          (_, index) => index !== indexToRemove
        );
        const updatedRequest = {
          ...request,
          [name]: updatedProperty,
        };
        setRequest(updatedRequest);
        onChange("request", updatedRequest);
      }
    };
  const removeAuthSection = (indexToRemove) => {
    if (request.auth && request.auth.length > 0) {
      const updatedAuth = [...request.auth];
      updatedAuth.splice(indexToRemove, 1); // Remove the auth section at the specified index
      const updatedRequest = { ...request, auth: updatedAuth };
      setRequest(updatedRequest);
      onChange("request", updatedRequest);
    }
  };
  
  const addAuthSection = () => {
    const newAuth = {};
    if (!request["auth"] || request["auth"].length === 0) {
      onListValueChange("auth", 0, newAuth);
    } else {
      onListValueChange("auth", request["auth"].length, newAuth);
    }
  };

  return (
    <>
      <CustomFormGroup
        controls={[
          {
            label: "Method",
            type: "buttongroup",
            selectedButton: request["method"],
            onButtonClick: (e) => {
              console.log(e, "click");
              onValueChange("method", e);
            },
            width: "90%",
            labelColWidth: 3,
            inputColWidth: 9,
            buttonGroupOptions: methodType,
            formId: "method",
          },
        ]}
      />
      <div>
        <div className="custom-grid">
          <div className="custom-grid-item three">
            <Form.Label className="outer-label">URLs:</Form.Label>
          </div>
          <div className="custom-grid-item nine outer-control">
            {<Urls urlData={request["url"]} onChange={onUrlValueChange} />}
          </div>
        </div>
      </div>

      {renderAuth && (
        <div>
          <div className="custom-grid">
            <div className="custom-grid-item three">
              <Form.Label className="outer-label">Auth:</Form.Label>
              <Button variant="secondary" size="sm" onClick={addAuthSection}>
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                  alt="add--v1"
                />{" "}
              </Button>
            </div>
            {
              <div className="custom-grid-item nine outer-control">
                {request["auth"] &&
                  request["auth"].map((auth, index) => (
                    <Auth
                      key={index}
                      index={index}
                      onChange={onListValueChange}
                      auth={auth}
                      tokenApis={tokenApis}
                      loginApis={loginApis}
                      onRemove={() => removeAuthSection(index)}
                    />
                  ))}
              </div>
            }
          </div>
        </div>
      )}

      <div className="custom-grid">
        <div className="custom-grid-item three">
          <Form.Label className="outer-label">Parameter:</Form.Label>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              addProperty("parameters", {
                param_in: "",
                type: "",
                required: false,
                description: "",
                name: "",
              })
            }
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
              alt="add--v1"
            />{" "}
          </Button>
        </div>
        {request["parameters"] && (
          <div
            className="custom-grid-item nine outer-control"
            style={{
              flexDirection: "row",
              justifyContent: "normal",
            }}
          >
            {request["parameters"].map((parameter, index) => (
              <Parameter
                key={parameter.id}
                index={index}
                onChange={onListValueChange}
                parameterData={parameter}
                onRemove={() => removeProperty("parameters", index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="custom-grid">
        <div className="custom-grid-item three">
          <Form.Label className="outer-label">Body:</Form.Label>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              addProperty("body", {
                mode: "RAW",
                content_type: "NONE",
                schema_name: "",
                anonymous: false,
              })
            }
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
              alt="add--v1"
            />{" "}
          </Button>
        </div>
        {
          <div className="custom-grid-item nine outer-control">
            {request["body"].map((body, index) => (
              <Body
                key={body.id}
                index={index}
                onChange={onListValueChange}
                bodyData={body}
                onRemove={() => removeProperty("body", index)}
              />
            ))}
          </div>
        }
      </div>
    </>
  );
}

export default Request;
