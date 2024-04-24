import React, { useEffect, useState } from 'react'
import { getAuthFileConfig } from "../../services/IntermediatesService.js";
import {Form, Row ,Col, Dropdown, Button  } from 'react-bootstrap';


function Auth({onChange , auth}) {

  const[authData , setAuthData] = useState([]);
  const [showAuthDropdowns, setShowAuthDropdowns] = useState(false);
 const [apis, setApis] = useState("");
 const [loginApis, setLoginApis] = useState([]);
 const [tokenApis, setTokenApis] = useState([]);
 const [index, setIndex] = useState(1);

  useEffect(()=>{
    const initialAuth =
      auth.authData > 0
        ? auth.map((authData) => ({
            type: authData.type ,
            content: authData.content ,
            login_api: authData.login_api ,
            token_api: authData.token_api ,
          }))
        : [
            {
              type: "No Auth",
              content: [{ key: "", value: "", type: "" }],
              loginApis: "",
              tokenAPis: "",
            },
          ];
          setAuthData(initialAuth)
// console.log(authData,"authData");
  },[auth]);

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
      (api) => api.auth_api_type === "Login"
    );
    const tokenApisFiltered = Object.values(apis).filter(
      (api) => api.auth_api_type === "Refresh"
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

 const handleAuthApiSelect = (index,apiId, property) => {
   const updatedAuthData = [...authData];
   updatedAuthData[index][property] = apiId;
   setAuthData(updatedAuthData);
   onChange(updatedAuthData);
 };

 const handleAuthContentChange = (index, contentIndex, property, value) => {
   const updatedAuthData = [...authData];
   updatedAuthData[index].content[contentIndex][property] = value;
   setAuthData(updatedAuthData);
   onChange(updatedAuthData);
 };

 const addAuthContent = (index) => {
     console.log(index, "index for adding content");
     const updatedAuthData = [...authData];
     console.log('updated',updatedAuthData);
     // Check if authData[index] exists before accessing its content property
     if (updatedAuthData[0] && updatedAuthData[0].content) {
         updatedAuthData[0].content.push({ key: "", value: "", type: "" });
         console.log(
           "length",
           updatedAuthData[0].content.length);
        //  console.log(
        //    "inside if",
        //    updatedAuthData[0].content.push({ key: "", value: "", type: "" })
        //  );
       setAuthData(updatedAuthData);
       console.log(updatedAuthData, "after adding content");
       onChange(updatedAuthData);
        setIndex((prevIndex) => {
            console.log("inside index", index);
            return prevIndex + 1;
        });
        
     }
    //  index+=1
    // console.log(index, "index after adding content");
 };

 const removeAuthContent = (index, contentIndex) => {
   const updatedAuthData = [...authData];
 if (updatedAuthData[index] && updatedAuthData[index].content) {
   updatedAuthData[index].content.splice(contentIndex, 1);
   setAuthData(updatedAuthData);
   console.log(updatedAuthData, "after removing");
   onChange(updatedAuthData);
    setIndex((prevIndex) => prevIndex - 1); 
 }
 index-=1
 console.log(index,"index remove content ");
 };


// console.log(authData,"auth  in auth.js updated");



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
                    <Dropdown.Item eventKey="No Auth" className="dropdownitem">
                      No Auth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Basic" className="dropdownitem">
                      Basic
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Bearer" className="dropdownitem">
                      Bearer
                    </Dropdown.Item>

                    <Dropdown.Item eventKey="Oauth" className="dropdownitem">
                      Oauth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Oauth2" className="dropdownitem">
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
                          {auth.login_api ? auth.login_api : "Login Api"}
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
               
                {authItem.content &&
                  authItem.content.map((authContent, contentIndex) => (
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
                        value={authContent[1]?.value}
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
                        value={authContent[2]?.type}
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
                        onClick={() => removeAuthContent(authIndex,index)}
                      >
                        Remove
                      </Button>
                
                    </div>
                     <Button
                  variant="secondary"
                  className="mx-5 mt-2"
                  onClick={() => addAuthContent(index)}
                >
                  Add AuthContent
                </Button>
                </>
                  ))}
{/* 
                <Button
                  variant="secondary"
                  className="mx-5 mt-2"
                  onClick={() => addAuthContent(authIndex)}
                >
                  Add AuthContent
                </Button> */}
              </Col>
            </Row>
          </div>
        ))}
      </Form.Group>
    </div>
  );
}

export default Auth
