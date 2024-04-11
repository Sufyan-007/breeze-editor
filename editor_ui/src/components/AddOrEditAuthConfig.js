import React, { useState, useEffect } from "react";
import { Form, Button} from "react-bootstrap";
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
function AddOrEditAuthConfig({
  availableApis,
  onClose,
  authApis,
  selectedUuid,
  mode,
}) {
  const [selectedApi, setSelectedApi] = useState("");
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
  const selectedAuthApi = Object.values(authApis).find(
    (api) => api.uuid === selectedUuid
  );

  const handleSave = () => {
    let token_store = {
      store_in: selectedTokenStorageMethod,
      access_token_key: selectedAccessKey,
      refresh_token_key: selectedRefreshKey
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
      tags: authApis[selectedApi].tags,
      summary: authApis[selectedApi].summary,
      auth_api_type: selectedType,
      authentication_type: selectedAuthentication.toUpperCase(),
      is_authorization_url: selectedAuthentication === "oauth2" ? true : false,
      flow: flow,
      token_store: token_store,
    };

    console.log(resultantApi, "resultant");
    console.log(authApis[selectedApi], "selected api");
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
          {isEditMode
            ? "Edit Authentication Configuration"
            : "Add Authentication Configuration"}
        </h2>
        <Button variant="secondary" onClick={onClose} size="sm">
          <img src={close} alt="" height={24} className="mx-2" />
        </Button>
      </div>
      {authApis && !isEditMode ? (
        // {it should be available api instead of authapi }
        <div>
          <Form>
            <SelectApi
              availableApis={authApis}
              selectedApi={selectedApi}
              onSelectApi={setSelectedApi}
            />
            {selectedApi && (
              <div>
                <SelectType
                  selectedType={selectedType}
                  onSelectType={setSelectedType}
                />
                <SelectAuthentication
                  selectedAuthentication={selectedAuthentication}
                  onSelectAuthentication={setSelectedAuthentication}
                />
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
                {selectedTokenStorageMethod && <SelectKey
                  selectedAccessKey={selectedAccessKey}
                  onSetAccessKey={setSelectedAccessKey}
                  selectedRefreshKey={selectedRefreshKey}
                  onSetRefreshKey={setSelectedRefreshKey}
                  tokenStorageMethod={selectedTokenStorageMethod}
                />}
              </div>
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
      ) : isEditMode ? (
        <div style={{ overflow: "auto", maxHeight: "80vh" }}>
          <CustomPanel
            dummyData={selectedAuthApi}
            tagsList={["tag1", "tag2", "tag3"]}
          />
        </div>
      ) : (
        <p>
          No authentication APIs available. Please create APIs in the backend.
        </p>
      )}
    </div>
  );
}

export default AddOrEditAuthConfig;
