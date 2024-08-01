import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import { getAuthFileApis } from "../../../services/AuthApiService";
import { useParams } from "react-router";
function AuthSettings({ authData, onChange, apiData, onApiChange }) {
  // console.log(apiData, "auth");
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);
  const { projectName } = useParams();
  const handleInputChange = (index, field, value) => {
    const updatedAuth = [...authData];
    updatedAuth[index] = { ...updatedAuth[index], [field]: value };
    onChange("auth", updatedAuth);
  };

  const handleDelete = (index) => {
    const updatedAuth = [...authData];
    updatedAuth.splice(index, 1);
    onChange("auth", updatedAuth);
  };
  const handleAdd = () => {
    const newAuth = {
      type: "",
      contents: [],
      login_api: "",
      token_api: null,
      errors: null,
    };
    if (!authData) authData = [];
    const updatedAuth = [...authData, newAuth];
    onChange("auth", updatedAuth);
  };
  const setAuthApis = useCallback(async () => {
    const result = await getAuthFileApis(projectName, null);
    let login_api = [];
    let token_api = [];
    if (!Array.isArray(result.data)) {
      console.error("Data is not an array:", result.data);
      return;
    }

    for (let api of result.data) {
      if (api.auth_api_type === "LOGIN") {
        login_api.push({
          id: api.id,
          operation_id: api.operation_id,
        });
      }
      if (api.auth_api_type === "REFRESH") {
        token_api.push({
          id: api.id,
          operation_id: api.operation_id,
        });
      }
    }
    setLoginApis(login_api);
    setTokenApis(token_api);
  }, [projectName]);

  useEffect(() => {
    setAuthApis();
  }, [setAuthApis]);

  const handleFlowChange = (prop, value) => {
    const updatedFlow = apiData.flow || {};
    updatedFlow[prop] = value;
    onApiChange("flow", updatedFlow);
  };
  const handleTokenStoreChange = (prop, value) => {
    const updatedTokenStore = apiData.token_store || {};
    updatedTokenStore[prop] = value;
    onApiChange("token_store", updatedTokenStore);
  };
  return (
    <>
      {apiData.is_authentication_api || true ? (
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
                  value={apiData.authentication_type}
                  onChange={(e) =>
                    onApiChange("authentication_type", e.target.value)
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

            {apiData.authentication_type === "BASIC" ? (
              <>
                {/* <div className="mx-3 mb-1" style={{ width: "50%" }}>
                  <Form.Label className="text-white mb-1">UserName:</Form.Label>
                  <Form.Control
                    className="text-white"
                    size="sm"
                    type="text"
                    placeholder="Value"
                    // value={defaultSchemaObj.name}
                    // onChange={(e) =>
                    //   setDefaultSchemaObj({
                    //     ...defaultSchemaObj,
                    //     name: e.target.value,
                    //   })
                    // }
                    style={{
                      backgroundColor: "#212529",
                      border: "1px solid rgba(128, 128, 128, 0.5)",
                    }}
                  />
                </div>
                <div className="mx-3 mb-1" style={{ width: "50%" }}>
                  <Form.Label className="text-white mb-1">Password:</Form.Label>
                  <Form.Control
                    className="text-white"
                    size="sm"
                    type="text"
                    placeholder="Value"
                    // value={defaultSchemaObj.name}
                    // onChange={(e) =>
                    //   setDefaultSchemaObj({
                    //     ...defaultSchemaObj,
                    //     name: e.target.value,
                    //   })
                    // }
                    style={{
                      backgroundColor: "#212529",
                      border: "1px solid rgba(128, 128, 128, 0.5)",
                    }}
                  />
                </div> */}
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
                    // value={auth.login_api}
                    // onChange={(e) =>
                    //   handleInputChange(index, "login_api", e.target.value)
                    // }
                  >
                    <option value="">Select</option>
                    {loginApis.map((api) => (
                      <option key={api.id} value={api.id}>
                        {api.operation_id}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                {/* <div className="mx-3 mb-1" style={{ width: "50%" }}>
                  <Form.Label className="text-white mb-1">
                    Token Api:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="text-white"
                    size="sm"
                    style={{
                      backgroundColor: "#212529",
                      border: "1px solid rgba(128, 128, 128, 0.5)",
                    }}
                    // value={auth.login_api}
                    // onChange={(e) =>
                    //   handleInputChange(index, "login_api", e.target.value)
                    // }
                  >
                    <option value="">Select</option>
                    {tokenApis.map((api) => (
                      <option key={api.id} value={api.id}>
                        {api.operation_id}
                      </option>
                    ))}
                  </Form.Control>
                </div> */}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {authData && authData.length > 0 ? (
            authData.map((auth, index) => (
              <div
                key={index}
                className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
                <div
                  style={{ width: "90%" }}
                  className="d-flex align-items-center mb-1">
                  <div className="mx-3 mb-1" style={{ width: "50%" }}>
                    <Form.Label className="text-white mb-1">
                      Login Api:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="text-white"
                      size="sm"
                      style={{
                        backgroundColor: "#212529",
                        border: "1px solid rgba(128, 128, 128, 0.5)",
                      }}
                      value={auth.login_api}
                      onChange={(e) =>
                        handleInputChange(index, "login_api", e.target.value)
                      }>
                      <option value="">Select</option>
                      {loginApis.map((api) => (
                        <option key={api.id} value={api.id}>
                          {api.operation_id}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                  <div className="mx-3 mb-1" style={{ width: "50%" }}>
                    <Form.Label className="text-white mb-1">
                      Token Api:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="text-white"
                      size="sm"
                      style={{
                        backgroundColor: "#212529",
                        border: "1px solid rgba(128, 128, 128, 0.5)",
                      }}
                      value={auth.token_api}
                      onChange={(e) =>
                        handleInputChange(index, "token_api", e.target.value)
                      }>
                      <option value="">Select</option>
                      {tokenApis.map((api) => (
                        <option key={api.id} value={api.id}>
                          {api.operation_id}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-1 mx-3">
                  <img
                    alt="delete"
                    className="mt-4"
                    height={25}
                    width={25}
                    src={Delete}
                    onClick={() => handleDelete(index)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex justify-content-center">
              <span className="text-white">-----No Auth Present-----</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AuthSettings;
