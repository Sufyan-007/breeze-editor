import React from "react";
import { Form, Table } from "react-bootstrap";
import Delete from "../../assets/icons/delete.svg";
function NewAuthentication({
  isAuthApi,
  authApiType,
  authType,
  loginApis,
  tokenApis,
  tokenStore,
  authArray,
  onChange,
  onReqChange,
  flow_type,
  flow,
  deleteAuthProps,
}) {
  const handleChanges = (prop, value, parent = null, parent_name = null) => {
    console.log(prop, value, parent, parent_name);
    if (prop === "is_authentication_api" && value === false) {
      console.log("deleting......");
      deleteAuthProps([
        "auth_api_type",
        "authentication_type",
        "token_store",
        "flow_type",
        "flow",
      ]);
    }
    if (parent && parent_name) {
      const newProp = { ...parent, [prop]: value };
      console.log(newProp, "newprop");
      onChange(parent_name, newProp);
    } else {
      onChange(prop, value);
    }
  };
  const addAuthSection = () => {
    const auth_obj = {
      type: "BEARER",
      contents: [],
      login_api: "",
      token_api: "",
    };
    const updatedAuthArray = [...authArray, auth_obj];
    onReqChange("auth", updatedAuthArray);
  };
  const addAuthContent = (index) => {
    const updatedAuthArray = [...authArray];
    updatedAuthArray[index].contents.push({
      key: "",
      value: "",
      type: "string",
    });
    onReqChange("auth", updatedAuthArray);
  };
  const handleDelete = (index, type = "auth", contentIndex) => {
    console.log(index, type);
    if (type === "auth") {
      const updatedAuthArray = [...authArray];
      updatedAuthArray.splice(index, 1);
      onReqChange("auth", updatedAuthArray);
    } else if (type === "content") {
      const updatedAuthArray = [...authArray];
      updatedAuthArray[index].contents.splice(contentIndex, 1);
      console.log(updatedAuthArray, "updatedauth");
      onReqChange("auth", updatedAuthArray);
    }
  };
  const handleContentChange = (contentIndex, prop, value, authIndex) => {
    console.log(contentIndex, prop, value, authIndex);
    const updatedAuthArray = [...authArray];
    if (contentIndex !== null) {
      console.log(contentIndex, "content index");
      updatedAuthArray[authIndex].contents[contentIndex][prop] = value;
    } else {
      updatedAuthArray[authIndex][prop] = value;
    }

    onReqChange("auth", updatedAuthArray); // Pass the updated auth array
  };
  return (
    <>
      <div>
        <Form.Label className="mx-2 mt-2" style={{ color: "white" }}>
          Is Authentication Api ?
        </Form.Label>
        <Form.Check
          className="mx-3"
          style={{ display: "inline-block" }}
          type="checkbox"
          checked={isAuthApi}
          onChange={(e) =>
            handleChanges("is_authentication_api", e.target.checked)
          }
        />
        {!isAuthApi && (
          <img
            className="mx-4 mb-2"
            width="24"
            height="24"
            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
            alt="add--v1"
            style={{ cursor: "pointer" }}
            onClick={addAuthSection}
          />
        )}
      </div>
      <div
        style={{
          // border: "1px solid blue",
          height: "100%",
          width: "100%",
          display: "flex",
        }}>
        {isAuthApi ? (
          <>
            <div id="left" style={{ width: "50%", height: "100%" }}>
              <div>
                <Form.Label
                  className="mx-2"
                  style={{ color: "white", width: "40%" }}>
                  Authentication Type :
                </Form.Label>
                <Form.Select
                  className="mt-2"
                  style={{
                    height: "20%",
                    width: "50%",
                    borderRadius: "0%",
                    // backgroundColor: "#303033",
                    backgroundColor: "#212529",
                    color: "white",
                    display: "inline-block",
                  }}
                  value={authType}
                  onChange={(e) =>
                    handleChanges("authentication_type", e.target.value)
                  }>
                  <option value="BEARER">Bearer</option>
                  <option value="OAUTH">Oauth</option>
                  <option value="OAUTH2">Oauth2</option>
                  <option value="BASIC">Basic</option>
                  <option value="APIKEY">ApiKey</option>
                </Form.Select>
              </div>
              {authType && authType === "OAUTH2" && (
                <>
                  <div id="flow-type">
                    <Form.Label
                      className="mx-2"
                      style={{ color: "white", width: "40%" }}>
                      Flow :
                    </Form.Label>
                    <Form.Select
                      className="mt-2"
                      style={{
                        height: "20%",
                        width: "50%",
                        borderRadius: "0%",
                        // backgroundColor: "#303033",
                        backgroundColor: "#212529",
                        color: "white",
                        display: "inline-block",
                      }}
                      value={flow_type}
                      onChange={(e) =>
                        handleChanges("flow_type", e.target.value)
                      }>
                      <option value="authorization_code">
                        Authorization Code
                      </option>
                      <option value="implicit">Implicit</option>
                      <option value="password">Password</option>
                      <option value="client_credentials">
                        Client Credentials
                      </option>
                    </Form.Select>
                  </div>

                  {flow_type === "authorization_code" && (
                    <div id="auth-url">
                      <Form.Label
                        className="mx-2"
                        style={{ color: "white", width: "40%" }}>
                        Authorization Url:
                      </Form.Label>
                      <Form.Control
                        className="mt-2"
                        type="text"
                        style={{
                          height: "20%",
                          width: "50%",
                          borderRadius: "0%",
                          // backgroundColor: "#303033",
                          backgroundColor: "#212529",
                          color: "white",
                          display: "inline-block",
                        }}
                        value={flow ? flow.authorization_url : ""}
                        onChange={(e) =>
                          handleChanges(
                            "authorization_url",
                            e.target.value,
                            flow ? flow : {},
                            "flow"
                          )
                        }
                      />
                    </div>
                  )}
                  <div id="token-url">
                    <Form.Label
                      className="mx-2"
                      style={{ color: "white", width: "40%" }}>
                      Token Url:
                    </Form.Label>
                    <Form.Control
                      className="mt-2"
                      type="text"
                      style={{
                        height: "20%",
                        width: "50%",
                        borderRadius: "0%",
                        // backgroundColor: "#303033",
                        backgroundColor: "#212529",
                        color: "white",
                        display: "inline-block",
                      }}
                      value={flow ? flow.token_url : ""}
                      onChange={(e) =>
                        handleChanges(
                          "token_url",
                          e.target.value,
                          flow ? flow : {},
                          "flow"
                        )
                      }
                    />
                  </div>
                  <div id="refresh-url">
                    <Form.Label
                      className="mx-2"
                      style={{ color: "white", width: "40%" }}>
                      Refresh Url:
                    </Form.Label>
                    <Form.Control
                      className="mt-2"
                      type="text"
                      style={{
                        height: "20%",
                        width: "50%",
                        borderRadius: "0%",
                        // backgroundColor: "#303033",
                        backgroundColor: "#212529",
                        color: "white",
                        display: "inline-block",
                      }}
                      value={flow ? flow.refresh_url : ""}
                      onChange={(e) =>
                        handleChanges(
                          "refresh_url",
                          e.target.value,
                          flow ? flow : {},
                          "flow"
                        )
                      }
                    />
                  </div>
                </>
              )}
              <div>
                <Form.Label
                  className="mx-2"
                  style={{ color: "white", width: "40%" }}>
                  Auth Api Type :
                </Form.Label>
                <Form.Select
                  className="mt-2"
                  style={{
                    height: "20%",
                    width: "50%",
                    borderRadius: "0%",
                    // backgroundColor: "#303033",
                    backgroundColor: "#212529",
                    color: "white",
                    display: "inline-block",
                  }}
                  value={authApiType}
                  onChange={(e) =>
                    handleChanges("auth_api_type", e.target.value)
                  }>
                  <option value="LOGIN">LOGIN</option>
                  <option value="LOGOUT">LOGOUT</option>
                  <option value="REFRESH">REFRESH</option>
                </Form.Select>
              </div>
            </div>
            <div id="right" style={{ width: "50%", height: "100%" }}>
              <div>
                <Form.Label
                  className="mx-2"
                  style={{ color: "white", width: "40%" }}>
                  Storage Scheme:
                </Form.Label>
                <Form.Select
                  className="mt-2"
                  style={{
                    height: "20%",
                    width: "50%",
                    borderRadius: "0%",
                    // backgroundColor: "#303033",
                    backgroundColor: "#212529",
                    color: "white",
                    display: "inline-block",
                  }}
                  value={tokenStore ? tokenStore.store_in : ""}
                  onChange={(e) =>
                    handleChanges(
                      "store_in",
                      e.target.value,
                      tokenStore ? tokenStore : {},
                      "token_store"
                    )
                  }>
                  <option value="LOCAL_STORAGE">Local Storage</option>
                  <option value="SESSION_STORAGE">Session Storage</option>
                  <option value="COOKIES">Cookies</option>
                </Form.Select>
              </div>

              <div>
                <Form.Label
                  className="mx-2"
                  style={{ color: "white", width: "40%" }}>
                  Access Token Key :
                </Form.Label>
                <Form.Control
                  className="mt-2"
                  type="text"
                  style={{
                    height: "20%",
                    width: "50%",
                    borderRadius: "0%",
                    // backgroundColor: "#303033",
                    backgroundColor: "#212529",
                    color: "white",
                    display: "inline-block",
                  }}
                  value={tokenStore ? tokenStore.access_token_key : ""}
                  onChange={(e) =>
                    handleChanges(
                      "access_token_key",
                      e.target.value,
                      tokenStore ? tokenStore : {},
                      "token_store"
                    )
                  }
                />
              </div>

              <div>
                <Form.Label
                  className="mx-2"
                  style={{ color: "white", width: "40%" }}>
                  Refresh Token Key :
                </Form.Label>
                <Form.Control
                  className="mt-2"
                  type="text"
                  style={{
                    height: "20%",
                    width: "50%",
                    borderRadius: "0%",
                    // backgroundColor: "#303033",
                    backgroundColor: "#212529",
                    color: "white",
                    display: "inline-block",
                  }}
                  value={tokenStore ? tokenStore.refresh_token_key : ""}
                  onChange={(e) =>
                    handleChanges(
                      "refresh_token_key",
                      e.target.value,
                      tokenStore ? tokenStore : {},
                      "token_store"
                    )
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div id="normal-api-section" style={{ width: "100%" }}>
              <Table bordered hover variant="dark" className="mt-3">
                <tbody>
                  {authArray &&
                    authArray.map((auth, index) => (
                      <tr key={index}>
                        <td style={{ width: "10%" }}>
                          <Form.Select
                            className="m2"
                            style={{
                              borderRadius: "0%",
                              backgroundColor: "#212529",
                              color: "white",
                              display: "inline-block",
                            }}
                            value={auth.type}
                            onChange={(e) =>
                              handleContentChange(
                                null,
                                "type",
                                e.target.value,
                                index
                              )
                            }>
                            <option value="BEARER">Bearer</option>
                            <option value="OAUTH">Oauth</option>
                            <option value="OAUTH2">Oauth2</option>
                            <option value="BASIC">Basic</option>
                            <option value="APIKEY">ApiKey</option>
                          </Form.Select>
                        </td>
                        <td style={{ width: "20%" }}>
                          {"Login Api :"}
                          <Form.Select
                            className="mx-2"
                            style={{
                              width: "60%",
                              borderRadius: "0%",
                              backgroundColor: "#212529",
                              color: "white",
                              display: "inline-block",
                            }}
                            value={auth.login_api}
                            onChange={(e) =>
                              handleContentChange(
                                null,
                                "login_api",
                                e.target.value,
                                index
                              )
                            }>
                            {loginApis.map((api) => (
                              <option key={api.id} value={api.id}>
                                {api.operation_id}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td style={{ width: "20%" }}>
                          {"Token Api :"}
                          <Form.Select
                            className="mx-2"
                            style={{
                              width: "60%",
                              borderRadius: "0%",
                              backgroundColor: "#212529",
                              color: "white",
                              display: "inline-block",
                            }}
                            value={auth.token_api}
                            onChange={(e) =>
                              handleContentChange(
                                null,
                                "token_api",
                                e.target.value,
                                index
                              )
                            }>
                            {tokenApis.map((api) => (
                              <option key={api.id} value={api.id}>
                                {api.operation_id}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td style={{ width: "40%" }}>
                          <img
                            className="mx-4 mb-2"
                            width="24"
                            height="24"
                            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                            alt="add--v1"
                            style={{ cursor: "pointer" }}
                            onClick={() => addAuthContent(index)}
                          />
                          {auth.contents.length > 0 &&
                            auth.contents.map((content, idx) => (
                              <div key={idx} className="mx-3">
                                <Form.Control
                                  className="mx-2"
                                  type="text"
                                  style={{
                                    height: "20%",
                                    width: "20%",
                                    borderRadius: "0%",
                                    // backgroundColor: "#303033",
                                    backgroundColor: "#212529",
                                    color: "white",
                                    display: "inline-block",
                                  }}
                                  value={content.key}
                                  onChange={(e) =>
                                    handleContentChange(
                                      idx,
                                      "key",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                                <Form.Control
                                  className="mx-2"
                                  type="text"
                                  style={{
                                    height: "20%",
                                    width: "45%",
                                    borderRadius: "0%",
                                    // backgroundColor: "#303033",
                                    backgroundColor: "#212529",
                                    color: "white",
                                    display: "inline-block",
                                  }}
                                  value={content.value}
                                  onChange={(e) =>
                                    handleContentChange(
                                      idx,
                                      "value",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                                <Form.Select
                                  className="mx-2"
                                  style={{
                                    height: "20%",
                                    width: "20%",
                                    borderRadius: "0%",
                                    // backgroundColor: "#303033",
                                    backgroundColor: "#212529",
                                    color: "white",
                                    display: "inline-block",
                                  }}
                                  value={content.type}
                                  onChange={(e) =>
                                    handleContentChange(
                                      idx,
                                      "type",
                                      e.target.value,
                                      index
                                    )
                                  }>
                                  <option value="integer">Integer</option>
                                  <option value="string">String</option>
                                </Form.Select>
                                <img
                                  className="mx-2"
                                  src={Delete}
                                  alt="Delete"
                                  onClick={() =>
                                    handleDelete(index, "content", idx)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                              </div>
                            ))}
                        </td>
                        <td style={{ width: "5%" }}>
                          <img
                            className="mx-2"
                            src={Delete}
                            alt="Delete"
                            onClick={() => handleDelete(index, "auth", null)}
                            style={{
                              cursor: "pointer",
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default NewAuthentication;
