import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import CustomPanel from "./CustomPanel";
import close from "../assets/icons/close.svg";
import "../css/AddOrEditAuthConfigStyles.css";
import SelectApi from "./AddOrEditAuthConfigSubComponents/SelectApi";
import SelectType from "./AddOrEditAuthConfigSubComponents/SelectType";
import SelectFlow from "./AddOrEditAuthConfigSubComponents/SelectFlow";
import AuthorizationUrls from "./AddOrEditAuthConfigSubComponents/AuthorizationUrls";
import SelectAuthentication from "./AddOrEditAuthConfigSubComponents/SelectAuthentication";
import SelectTokenStorage from "./AddOrEditAuthConfigSubComponents/SelectTokenStorage";
import SelectKey from "./AddOrEditAuthConfigSubComponents/SelectKey";
import {getAuthApiConfig} from '../services/IntermediatesService.js'

import { appendToAuthApi } from "../services/IntermediatesService";
import  CustomButtonGroup from "./CustomButtonGroup.js";

function AddOrEditAuthConfig({
  availableApis,
  onClose,
  authApis,
  selectedUuid,
  mode,
}) {
  const [selectedApi, setSelectedApi] = useState("");
  const [selectedApiInfo, setSelectedApiInfo] = useState({});
  
  const [selectedType, setSelectedType] = useState("");
  const [selectedAuthentication, setSelectedAuthentication] = useState("");
  const [selectedFlow, setSelectedFlow] = useState("");
  const [authorizationUrl, setAuthorizationUrl] = useState("");
  const [tokenUrl, setTokenUrl] = useState("");
  const [refreshUrl, setRefreshUrl] = useState("");

  const [selectedTokenStorageMethod, setSelectedTokenStorageMethod] =
    useState("");
  const [selectedAccessKey, setSelectedAccessKey] = useState("");
  const [selectedRefreshKey, setSelectedRefreshKey] = useState("");

  const isEditMode = mode === "Edit" ? true : false;
  let selectTypes = [
    {
      name : "LOGOUT",
      label : "Logout",
      variant : "secondary",
    },
    {
      name : "REFRESH",
      label : "Refresh",
      variant : "secondary",
    },
    {
      name : "LOGIN",
      label : "Login",
      variant : "secondary",
    }
  ]
  let authenticationTypes = [
    {
      name : "BASIC",
      label : "Basic",
      variant : "secondary",
    },
    {
      name : "OAUTH2",
      label : "OAUTH2",
      variant : "secondary",
    },
    {
      name : "BEARER",
      label : "Bearer",
      variant : "secondary",
    }
  ] 

  const onValueChanges = ( name, value) => {
    let obj = {
      ...selectedApiInfo
    }
    obj[name] = value;
    setSelectedApiInfo({
      ...obj
    }) 
  } 

  useEffect( () => {
    const fetchAuthApi = async () => {
      if(selectedUuid){
        let rs = await getAuthApiConfig("creator",selectedUuid)
        setSelectedApiInfo({...rs.data});
      }
    };
    fetchAuthApi()
    console.log("selce");
    console.log(selectedUuid);
    
  },[])
  const handleSave = async() => {
    let token_store = {
      store_in: selectedTokenStorageMethod,
      access_token_key: selectedAccessKey,
      refresh_token_key: selectedRefreshKey,
    };

    let flow = {};
    flow.authorizationUrl = authorizationUrl;
    flow.refreshUrl = refreshUrl;
    if (
      selectedAuthentication === "oauth2" &&
      selectedFlow === "authorizationCode"
    ) {
      flow.tokenUrl = tokenUrl;
    }

    const resultantApi = {
      request: authApis[selectedApi].request,
      response: authApis[selectedApi].response,
      operation_id: authApis[selectedApi].operation_id,
      // operation_id: "new_auth_api",
      tags: authApis[selectedApi].tags,
      summary: authApis[selectedApi].summary,
      auth_api_type: selectedType,
      authentication_type: selectedAuthentication.toUpperCase(),
      is_authorization_url: selectedAuthentication === "oauth2" ? true : false,
      flow: flow,
      token_store: token_store,
    };
    await appendToAuthApi(resultantApi,"add")
  };

  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "80vh",
        maxWidth: "100%",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h2 style={{ color: "white" }}>
          {isEditMode ? "" : "Add Authentication Configuration"}
        </h2>
        <Button variant="secondary" onClick={onClose} size="sm">
          <img src={close} alt="" height={24} className="mx-2" />
        </Button>
      </div>
      {selectedApiInfo  ? 
        // {it should be available api instead of authapi }
        <div>
          <Form>
            <Form.Control
              type="text"
              value={selectedApiInfo.operation_id}
              name="operation_id"
              onChange={(e) => onValueChanges("operation_id",e.target.value)}
            />
            <CustomButtonGroup options={selectTypes}  selectedButton = {selectedApiInfo.auth_api_type} onButtonClick={onValueChanges} formId = "auth_api_type" title= "Select Type:">

            </CustomButtonGroup>
            {/* <SelectType
              value={}
              selectedType={selectedType}
              onSelectType={setSelectedType}
            /> */}
            <CustomButtonGroup options={authenticationTypes}  selectedButton = {selectedApiInfo.authentication_type} onButtonClick={onValueChanges} formId = "authentication_type" title= "Authentication Scheme:">

            </CustomButtonGroup>

             
              {selectedAuthentication === "oauth2" && (
                <>
                  <SelectFlow
                    selectedFlow={selectedFlow}
                    onSelectFlow={setSelectedFlow}
                    selectedAuthentication={selectedAuthentication}
                  />
                  <AuthorizationUrls
                    authorizationUrl={authorizationUrl}
                    tokenUrl={tokenUrl}
                    refreshUrl={refreshUrl}
                    onSetAuthorizationUrl={setAuthorizationUrl}
                    onSetTokenUrl={setTokenUrl}
                    onSetRefreshTokenUrl={setRefreshUrl}
                    selectedFlow={selectedFlow}
                    selectedAuthentication={selectedAuthentication}
                  />
                </>
              )}
              <SelectTokenStorage
                selectedTokenStorageMethod={selectedTokenStorageMethod}
                onSelectTokenStorage={setSelectedTokenStorageMethod}
              />
              {selectedTokenStorageMethod && (
                <SelectKey
                  selectedAccessKey={selectedAccessKey}
                  onSetAccessKey={setSelectedAccessKey}
                  selectedRefreshKey={selectedRefreshKey}
                  onSetRefreshKey={setSelectedRefreshKey}
                  tokenStorageMethod={selectedTokenStorageMethod}
                />
              )}
            
            <Button
              className="mt-5"
              variant="secondary"
              style={{ width: "10%" }}
              onClick={handleSave}>
              Save
            </Button>
          </Form>
        </div>
       : (
        <p>
          No authentication APIs available. Please create APIs in the backend.
        </p>
      )}
    </div>
  );
}

export default AddOrEditAuthConfig;
