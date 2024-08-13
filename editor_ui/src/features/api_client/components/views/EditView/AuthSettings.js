import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import { getAuthFileApis } from "../../../services/AuthApiService";
import { useParams } from "react-router";
function AuthSettings({ authData, onChange, apiData, onApiChange, moduleId }) {
  // console.log(apiData, "auth");
  const [auth, setAuth] = useState(authData ? authData[0] : {});
  const [loginApis, setLoginApis] = useState([]);
  const { projectName } = useParams();

  const setAuthApis = useCallback(async (moduleId) => {
    const result = await getAuthFileApis(projectName, null, moduleId);
    let login_api = [];
    if (!Array.isArray(result.data)) {
      console.error("Data is not an array:", result.data);
      return;
    }
    for (let api of result.data) {
      if (api.response_tokens) {
        for (const [key, config] of Object.entries(api.response_tokens)) {
          login_api.push({
            id: api.id,
            operation_id: api.operation_id,
            tokenKey: `${api.operation_id}-${key}`,
            tokenConfig: config
          });
        }
      }
    }
    console.log(login_api, "loginapidjfkdsjfklsdjf");
    setLoginApis(login_api);
  }, [projectName]);

  const handleChange = (event, field) => {
    const selectedValue = event.target.value;
    const updatedAuthData = { ...auth };
    if(field === "login_api")
    {
      const apiId = event.target.options[event.target.selectedIndex].getAttribute('data-id');
      const tokenId = selectedValue.split('-')[1];
      updatedAuthData[field] = apiId;
      updatedAuthData["token_id"] = tokenId;
    }
    else{
      updatedAuthData[field] = selectedValue;
    }
    // console.log(updatedAuthData, "updatedAuthData");
    onChange("auth", [updatedAuthData])
  }

  useEffect(() => {
    console.log(moduleId, "moduleiddd");
    setAuthApis(moduleId);
  }, [setAuthApis, moduleId]);

  useEffect(() => {
    if (authData && authData.length > 0)
      setAuth(authData[0])
  }, [authData])


  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>{key}:{message}</div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <div id="main" className="d-flex mx-2">
        <div id="left" className="h-full w-50">
          <div className="mx-3 mb-1">
            <Form.Label className="text-white mb-1">
              Authentication Type:
            </Form.Label>
            <Form.Control
              as="select"
              className="text-white"
              size="sm"
              style={{
                backgroundColor: "#212529",
                border: "1px solid rgba(128, 128, 128, 0.5)",
              }}
              value={auth.type}
              onChange={(e) =>
                handleChange( e, "type")
              }>
              <option value="">Select</option>
              <option value="BEARER">Bearer</option>
              <option value="OAUTH">Oauth</option>
              <option value="OAUTH2">Oauth2</option>
              <option value="BASIC">Basic</option>
              <option value="APIKEY">ApiKey</option>
            </Form.Control>
          </div>
        </div>

        {auth.type === "BASIC" ? (
          <>

          </>
        ) : (
          <>
            <div className="mx-3 mb-1" style={{ width: "50%" }}>
              <Form.Label className="text-white mb-1">
                Authentication Api:
              </Form.Label>
              <Form.Control
                as="select"
                className="text-white"
                size="sm"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={loginApis.find(api => api.id === auth.login_api) ? `${loginApis.find(api => api.id === auth.login_api).operation_id}-${auth.token_id}` : ''}
                onChange={(e) =>
                  handleChange(e, "login_api")
                }
              >
                <option value="">Select</option>
                {loginApis.map((api) => (
                  <option key={api.tokenKey} value={api.tokenKey} data-id = {api.id}>
                    {api.tokenKey}
                  </option>
                ))}
              </Form.Control>
            </div>

          </>
        )}
      </div>
    </>
  );
}

export default AuthSettings;
