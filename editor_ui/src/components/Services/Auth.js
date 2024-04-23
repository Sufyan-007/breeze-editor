
// import React ,{useState} from 'react'
// import {Form, Button , Row, Col , Dropdown} from 'react-bootstrap';

// function Auth(props) {
//      const [auth, setAuth] = useState({
//        type: requestBody.auth?.type || "No Auth",
//        content: requestBody.auth?.content || [{ key: "", value: "", type: "" }],
//        login_api: requestBody.auth ? requestBody.auth.login_api : "",
//        token_api: requestBody.auth ? requestBody.auth.token_api : "",
//      });

//     //    const [showAuthDropdowns, setShowAuthDropdowns] = useState(false);
//     //    const [apis, setApis] = useState("");
//     //    const [loginApis, setLoginApis] = useState([]);
//     //    const [tokenApis, setTokenApis] = useState([]);
       
//     const handleAuthChange = (property, value) => {
//       setAuth({
//         ...auth,
//         [property]: value,
//       });
//       setShowAuthDropdowns(true);
//       onChange({ ...requestBody, auth: { ...auth, [property]: value } });
//     };


//   return (
//     <div>
//       <Form.Group controlId="formAuth" className="mt-3">
//         <Row>
//           <Col sm={3}>
//             <Form.Label>Authorization:</Form.Label>
//           </Col>
//           <Col sm={9}>
//             <Dropdown
//               className="mb-3"
//               onSelect={(value) => handleAuthChange("type", value)}
//             >
//               <Dropdown.Toggle variant="secondary" id="authTypeDropdown">
//                 {auth.type}
//               </Dropdown.Toggle>

//               <Dropdown.Menu style={{ textAlign: "center" }}>
//                 <Dropdown.Item eventKey="No Auth" className="dropdownitem">
//                   No Auth
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="Basic" className="dropdownitem">
//                   Basic
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="Bearer" className="dropdownitem">
//                   Bearer
//                 </Dropdown.Item>

//                 <Dropdown.Item eventKey="Oauth" className="dropdownitem">
//                   Oauth
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="Oauth2" className="dropdownitem">
//                   Oauth2
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>

//             {
//               <>
//                 <Row>
//                   <Col sm={3}>
//                     <Form.Label className="m-2">Login API:</Form.Label>
//                   </Col>
//                   <Col sm={9}>
//                     <Dropdown
//                       onSelect={(e) => handleAuthApiSelect(e, "login_api")}
//                       className="m-2"
//                     >
//                       <Dropdown.Toggle
//                         variant="secondary"
//                         id="loginApiDropdown"
//                       >
//                         {auth.login_api ? auth.login_api : "Login Api"}
//                       </Dropdown.Toggle>
//                       <Dropdown.Menu style={{ textAlign: "center" }}>
//                         {loginApis.map((api) => (
//                           <Dropdown.Item
//                             key={api.id}
//                             eventKey={api.id}
//                             className="dropdownitem"
//                           >
//                             {api.operation_id}
//                           </Dropdown.Item>
//                         ))}
//                       </Dropdown.Menu>
//                     </Dropdown>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col sm={3}>
//                     <Form.Label className="m-2">Token API:</Form.Label>
//                   </Col>
//                   <Col sm={9}>
//                     <Dropdown
//                       onSelect={(e) => handleAuthApiSelect(e, "token_api")}
//                       className="m-2"
//                     >
//                       <Dropdown.Toggle
//                         variant="secondary"
//                         id="tokenApiDropdown"
//                       >
//                         {auth.token_api ? auth.token_api : "Token Api"}
//                       </Dropdown.Toggle>
//                       <Dropdown.Menu style={{ textAlign: "center" }}>
//                         {tokenApis.map((api) => (
//                           <Dropdown.Item
//                             key={api.id}
//                             eventKey={api.id}
//                             className="dropdownitem"
//                           >
//                             {api.operation_id}
//                           </Dropdown.Item>
//                         ))}
//                       </Dropdown.Menu>
//                     </Dropdown>
//                   </Col>
//                 </Row>
//               </>
//             }

//             {/* List of AuthContent inputs */}
//             {auth.content.map((authContent, index) => (
//               <div key={index} className="d-flex mb-2">
//                 <Form.Control
//                   style={{
//                     maxWidth: "13vw",
//                     backgroundColor: "#6C757D",
//                     border: "none",
//                   }}
//                   type="text"
//                   placeholder="Key"
//                   value={authContent.key}
//                   onChange={(e) =>
//                     handleAuthContentChange(index, "key", e.target.value)
//                   }
//                   className="me-2"
//                 />
//                 <Form.Control
//                   style={{
//                     maxWidth: "13vw",
//                     backgroundColor: "#6C757D",
//                     border: "none",
//                   }}
//                   type="text"
//                   placeholder="Value"
//                   value={authContent.value}
//                   onChange={(e) =>
//                     handleAuthContentChange(index, "value", e.target.value)
//                   }
//                   className="me-2"
//                 />
//                 <Form.Control
//                   style={{
//                     maxWidth: "13vw",
//                     backgroundColor: "#6C757D",
//                     border: "none",
//                   }}
//                   type="text"
//                   placeholder="Type"
//                   value={authContent.type}
//                   onChange={(e) =>
//                     handleAuthContentChange(index, "type", e.target.value)
//                   }
//                 />
//                 <Button
//                   variant="secondary"
//                   className="ms-2"
//                   onClick={() => removeAuthContent(index)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             ))}

//             <Button
//               variant="secondary"
//               className="mt-2"
//               onClick={addAuthContent}
//             >
//               Add AuthContent
//             </Button>
//           </Col>
//         </Row>
//       </Form.Group>
//     </div>
//   );
// }

// export default Auth

