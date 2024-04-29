import React, { useState } from "react";
import { Button, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ServicePageSidebarCss from "../css/ServicePageSidebar.css";

import ServiceList from "./ServiceList";
import AuthenticationConfig from "./AuthenticationConfig";
import IntermediateFiles from "./IntermediateFiles";

// import { fetchIntermediate } from "../services/IntermediatesService";

export default function ServicePageNavbar(props) {
  const [showServicesList, setShowServicesList] = useState(false);
  const [showAuthenticationConfig, setShowAuthenticationConfig] = useState(false);
  const [showIntermediateFiles, setShowIntermediateFiles] = useState(false);
  const [showApiList, setShowApiList]=useState(false);
  
  const toggleServicesList = () => {
    setShowServicesList(!showServicesList);
    setShowAuthenticationConfig(false);
    setShowApiList(false);
    setShowIntermediateFiles(false);
  
  };
  const toggleAuthenticationConfig = () =>{
    setShowAuthenticationConfig(!showAuthenticationConfig)
    setShowServicesList(false)
    setShowApiList(false);
    setShowIntermediateFiles(false);
    
  }
  const toggleIntermediateFiles = () =>{
    setShowIntermediateFiles(!showIntermediateFiles)
    setShowServicesList(false)
    setShowApiList(false);
    setShowAuthenticationConfig(false);
    
  }

  return (
    <>
      <Navbar variant="dark" style={{ backgroundColor : "#212529"
      }}  >
        <Container className="mx-0" >
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" >
              <Nav.Link onClick={toggleServicesList} className="mx-3" >Services</Nav.Link>

              <NavDropdown title="Upload" className="mx-3" style={{color: "white"}}>
                <NavDropdown.Item onClick={() => props.openFileInput("yaml")}>
                  Upload Yaml
                </NavDropdown.Item>
                <input
                  ref={props.fileInputYAML}
                  type="file"
                  accept=".yaml, .yml"
                  hidden
                  onChange={(event) =>
                    props.fileUpload(event.target.files[0], "yaml")
                  }
                />

                <NavDropdown.Item
                  onClick={() => props.openFileInput("postman")}
                >
                  Upload Postman Collection
                </NavDropdown.Item>
                <input
                  ref={props.fileInputPostman}
                  type="file"
                  accept=".json"
                  hidden
                  onChange={(event) =>
                    props.fileUpload(event.target.files[0], "postman")
                  }
                />
                
                <NavDropdown.Item
                  onClick={() => props.handleCustomButtonClick()}
                >
                  Custom
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={toggleAuthenticationConfig} className="mx-3" >Authentication Config</Nav.Link>
              <Nav.Link onClick={toggleIntermediateFiles} className="mx-3" >Intermediates files</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showServicesList && <ServiceList apis={""} tagsList={["tag1", "tag2"]} />}
      {showAuthenticationConfig &&  <AuthenticationConfig />}
      {showIntermediateFiles &&  <IntermediateFiles />}

    </>
  );
}
