import React, { useEffect, useState } from "react";
import { getAuthFileConfig } from "../../services/IntermediatesService.js";
import { Form, Row, Col, Dropdown, Button } from "react-bootstrap";
function Auth({ onChange, auth }) {
  const [authData, setAuthData] = useState([]);
  const [showAuthDropdowns, setShowAuthDropdowns] = useState(false);
  const [apis, setApis] = useState("");
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);
  // const [index, setIndex] = useState(1);
  useEffect(() => {
    // console.log("initial auth", auth);
    const initialAuth =
      auth.length > 0
        ? auth.map((authData) => ({
            type: authData.type,
            contents: authData.contents,
            login_api: authData.login_api,
            token_api: authData.token_api,
          }))
        : [
            {
              type: "NOAUTH",
              contents: [{ key: "", value: "", type: "" }],
              login_api: "",
              token_api: "",
            },
          ];
    // console.log("dddddddddddd", initialAuth);
    setAuthData(initialAuth);
    
  }, [auth]);
  useEffect(() => {
    const fetchAuthApis = async () => {
      try {
        const data = await getAuthFileConfig("creator");
        setApis(data.data);
      } catch (error) {
        console.error("Error fetching auth APIs:", error);
      }
    };
    fetchAuthApis();
  }, []);
  useEffect(() => {
    // Filter APIs based on auth_api_type
    const loginApisFiltered = Object.values(apis).filter(
      (api) => api.auth_api_type === "LOGIN"
    );
    const tokenApisFiltered = Object.values(apis).filter(
      (api) => api.auth_api_type === "REFRESH"
    );
    setLoginApis(loginApisFiltered);
    setTokenApis(tokenApisFiltered);
  }, [apis]);
  // useEffect(()=>{
  //       const authItems = authData.map((authItem) => {
  //         // Perform any operations on authItem here
  //         console.log("authItem inside",authItem); // Log each authItem
  //         console.log("authItem.content",authItem.content);
  //         return authItem; // Return the authItem if needed
  //       });
  // },[authData])
  const handleAuthChange = (index, property, value) => {
    const updatedAuthData = [...authData];
    updatedAuthData[index][property] = value;
    setAuthData(updatedAuthData);
    setShowAuthDropdowns(true);
    onChange(updatedAuthData);
  };
  const handleAuthDropdownSelect = (value) => {
    handleAuthChange("api", value); // Update auth API
  };
  const handleAuthApiSelect = (index, apiId, property) => {
    const updatedAuthData = [...authData];
    updatedAuthData[index][property] = apiId;
    setAuthData(updatedAuthData);
    onChange(updatedAuthData);
  };
  const handleAuthContentChange = (index, contentIndex, property, value) => {
    const updatedAuthData = [...authData];
    updatedAuthData[index].contents[contentIndex][property] = value;
    setAuthData(updatedAuthData);
    onChange(updatedAuthData);
  };
  const addAuthContent = () => {
    //  console.log(index, "index for adding content");
    const updatedAuthData = [...authData];
    // Check if authData[index] exists before accessing its content property
    if (updatedAuthData.length) {
      updatedAuthData.map((authData) => {
        return authData.contents.push({ key: "", value: "", type: "" });
      });
      setAuthData(updatedAuthData);
      onChange(updatedAuthData);
    }
  };
  const removeAuthContent = (index, contentIndex) => {
    const updatedAuthData = [...authData];
    if (updatedAuthData.length) {
      console.log(contentIndex);
      updatedAuthData[index].contents.splice(contentIndex, 1);
      setAuthData(updatedAuthData);
      console.log(updatedAuthData, "after removing");
      onChange(updatedAuthData);
    }
  };
  // console.log(authData,"auth  in auth.js updated");
//   console.log(authData, "after adding content");
  return (
    <div>
      <Form.Group controlId="formAuth" className="mt-3">
        {authData.map((authItem, authIndex) => (
          <div key={authIndex}>
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Authorization:</Form.Label>
              </Col>
              <Col sm={9}>
                <Dropdown
                  className="mx-5 mb-3"
                  onSelect={(value) =>
                    handleAuthChange(authIndex, "type", value)
                  }
                >
                  <Dropdown.Toggle variant="secondary" id="authTypeDropdown">
                    {authItem.type}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ textAlign: "center" }}>
                    <Dropdown.Item eventKey="NOAUTH" className="dropdownitem">
                      No Auth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="BASIC" className="dropdownitem">
                      Basic
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="BEARER" className="dropdownitem">
                      Bearer
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="OAUTH" className="dropdownitem">
                      Oauth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="OAUTH2" className="dropdownitem">
                      Oauth2
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <>
                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-5 m-2">Login API:</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Dropdown
                        onSelect={(e) =>
                          handleAuthApiSelect(authIndex, e, "login_api")
                        }
                        className="mx-5 m-2"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="loginApiDropdown"
                        >
                          {authItem.login_api ? authItem.login_api : "Login Api"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ textAlign: "center" }}>
                          {loginApis.map((api) => (
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
                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-5 m-2">Token API:</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Dropdown
                        onSelect={(e) =>
                          handleAuthApiSelect(authIndex, e, "token_api")
                        }
                        className="mx-5 m-2"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="tokenApiDropdown"
                        >
                          {auth.token_api ? auth.token_api : "Token Api"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ textAlign: "center" }}>
                          {tokenApis.map((api) => (
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
                </>
                {authItem.contents &&
                  authItem.contents.map((authContent, contentIndex) => (
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
                          value={authContent?.key}
                          onChange={(e) =>
                            handleAuthContentChange(
                              authIndex,
                              contentIndex,
                              "key",
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
                          placeholder="Value"
                          value={authContent?.value}
                          onChange={(e) =>
                            handleAuthContentChange(
                              authIndex,
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
                          value={authContent?.type}
                          onChange={(e) =>
                            handleAuthContentChange(
                              authIndex,
                              contentIndex,
                              "type",
                              e.target.value
                            )
                          }
                        />
                        <Button
                          variant="secondary"
                          className="mx-5 ms-2"
                          onClick={() =>
                            removeAuthContent(authIndex, contentIndex)
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  ))}
                <Button
                  variant="secondary"
                  className="mx-5 mt-2"
                  onClick={() => addAuthContent()}
                >
                  Add AuthContent
                </Button>
              </Col>
            </Row>
          </div>
        ))}
      </Form.Group>
    </div>
  );
}
export default Auth;