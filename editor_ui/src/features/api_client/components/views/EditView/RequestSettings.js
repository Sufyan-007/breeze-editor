import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import edit from "../../../../../assets/icons/edit-icon.svg";
import HeadersSetting from "./HeadersSetting";
import AuthSettings from "./AuthSettings";
import UrlSettings from "./UrlSettings";
import BodySettings from "./BodySettings";

function RequestSettings({ requestData, onChange, apiData, isAuthApi, title, requestType }) {
  // console.log(apiData, "apidata");
  const [request, setRequest] = useState(requestData);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [api, setApi] = useState({});
  const [requestProperties, setRequestProperties] = useState(["Url","Body","Headers","Auth",]);

  useEffect(() => {
    if (apiData.is_open_api) {
      setRequestProperties(["Url", "Body", "Headers"]);
    } else {
      setRequestProperties(["Url", "Body", "Headers", "Auth"]);
    }
  }, [apiData.is_open_api]);
  useEffect(() => {
    if (isAuthApi) {
      console.log(apiData.authentication_type, "authentication_type")
      if (
        apiData.authentication_type === "BEARER" ||
        apiData.authentication_type === "APIKEY" || apiData.authentication_type === "OAUTH2"
      ) {
        setRequestProperties(["Url","Body", "Headers"]);
      }  else if (apiData.authentication_type === "BASIC") {
        setRequestProperties(["Body", "Headers"]);
      }
    } else {
      setRequestProperties(["Url", "Body", "Headers", "Auth"]);
    }
  }, [isAuthApi, apiData.authentication_type]);

  const addProperty = (prop) => {
    console.log(prop, "prop");
    let newData = null;
    if (prop === "query parameters") {
      prop = "parameters";
      const newParam = {
        name: "",
        param_in: "QUERY",
        type: "STRING",
        required: false,
        description: "",
      };
      if (!requestData.parameters) {
        requestData.parameters = [];
      }
      newData = [...requestData.parameters, newParam];
    } else if (prop === "headers") {
      const newHeader = { key: "", value: "" };
      if (!requestData.headers) {
        requestData.headers = [];
      }
      newData = [...requestData.headers, newHeader];
    } else if (prop === "auth") {
      const newAuth = {
        type: "",
        contents: [],
        login_api: "",
        token_api: null,
        errors: null,
      };
      if (!requestData.auth) {
        requestData.auth = [];
      }
      newData = [...requestData.auth, newAuth];
    }
    onReqChange(prop, newData);
  };

  useEffect(() => {
    setRequest(requestData);
  }, [requestData]);
  useEffect(() => {
    setApi(apiData);
  }, [apiData]);

  const onReqChange = (prop, value) => {
    console.log(prop, value);
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange(requestType, r);
  };
  // const onAuthReqChange = (prop,value)=>{
  //   let r = request;
  //   r[prop] = value;
  //   setRequest({...r})
  //   onChange("")
  // }
  const toggleProperty = (index) => {
    // console.log(index, "index");
    if (expandedProperty === index) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(index);
    }
  };
  return (
    <Row className="mt-3">
      <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
        <span className="mx-2">{title}</span>
      </div>
      <div className="p-1">
        {requestProperties &&
          requestProperties.map((req, index) => (
            <Card
              key={index}
              className="mt-1  rounded-0 text-white"
              bg="dark"
              style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
              <Card.Body className="d-flex justify-content-between">
                {req === "Url" && request.url && request.url.baseurl !== "" ? request.url.baseurl : req} 
                <div>
                  {req === "Headers" && (
                    <img
                      className="mx-1"
                      width="25"
                      height="25"
                      src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                      alt="add--v1"
                      onClick={() => addProperty(req.toLowerCase())}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  <img
                    alt="edit"
                    className="mx-1"
                    height={25}
                    width={25}
                    src={edit}
                    onClick={() => toggleProperty(index)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Card.Body>
              {expandedProperty === index &&
                (req.toLowerCase() === "headers" ? (
                  <Card.Body className="text-white">
                    <HeadersSetting
                      headerData={request.headers}
                      onChange={onReqChange}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "url" ? (
                  <Card.Body className="text-white">
                    <UrlSettings
                      urlData={request.url}
                      onChange={onReqChange}
                      paramData={
                        request.parameters || []
                        //   .filter(
                        //   (param) => param.param_in === "PATH"
                        // )
                      }
                      method={request.method}
                      onAdd={addProperty}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "loginurl" ? (
                  <Card.Body className="text-white">
                    <UrlSettings
                      urlData={request.url}
                      onChange={onReqChange}
                      paramData={
                        request.parameters || []
                        //   .filter(
                        //   (param) => param.param_in === "PATH"
                        // )
                      }
                      onAdd={addProperty}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "refreshurl" ? (
                  <Card.Body className="text-white">
                    <UrlSettings
                      urlData={request.url}
                      onChange={onReqChange}
                      paramData={
                        request.parameters || []
                        //   .filter(
                        //   (param) => param.param_in === "PATH"
                        // )
                      }
                      onAdd={addProperty}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "auth" ? (
                  <AuthSettings
                    authData={request.auth}
                    onChange={onReqChange}
                    apiData={api}
                    onApiChange={onChange}
                  />
                ) : req.toLowerCase() === "body" ? (
                  <BodySettings
                    bodyData={
                      request.body && request.body.length > 0
                        ? request.body[0]
                        : {
                          content_type: "",
                          mode: "",
                          required: false,
                          schema_name: "",
                          schema: {
                            type: "object",
                            properties: {},
                            required: [],
                          },
                        }
                    }
                    onChange={onReqChange}
                  />
                ) : (
                  <></>
                ))}
            </Card>
          ))}
      </div>
    </Row>
  );
}

export default RequestSettings;
