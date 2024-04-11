import React, { useState } from "react";
import { Button, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ServicePageSidebarCss from "../css/ServicePageSidebar.css";
import CustomPanel from "./CustomPanel";
import ServiceList from "./ServiceList";
import AuthenticationConfig from "./AuthenticationConfig";
// import { fetchIntermediate } from "../services/IntermediatesService";

export default function ServicePageNavbar(props) {
  const [showServicesList, setShowServicesList] = useState(false);
  const [showAuthenticationConfig, SetShowAuthenticationConfig] = useState(false);

  const toggleServicesList = () => {
    setShowServicesList(!showServicesList);
    SetShowAuthenticationConfig(false)
  };
  const toggleAuthenticationConfig = () =>{
    SetShowAuthenticationConfig(!showAuthenticationConfig)
    setShowServicesList(false)
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
                <NavDropdown.Item
                  onClick={() => props.openFileInput("postman")}
                >
                  Upload Postman Collection
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => props.handleCustomButtonClick()}
                >
                  Custom
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={toggleAuthenticationConfig} className="mx-3" >Authentication Config</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showServicesList && <ServiceList />}
      {showAuthenticationConfig &&  <AuthenticationConfig />}
    </>
  );
}
