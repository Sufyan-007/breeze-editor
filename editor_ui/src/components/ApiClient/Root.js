import React, { useState, useRef, useEffect } from "react";
import { Button, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ServiceList from "./ServiceList";
import AuthApiList from "./AuthApiList";
import EditAuthFunction from "./EditAuthFunction";
import EditServiceFuntion from './EditServiceFunction';


export default function Root() {
    const [view, setView] = useState("LIST_SERVICE");
    const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
    const [selectedAuthServiceId, setSelectedAuthServiceId] = useState(null);

    const onEditService = (serviceInfo) => {
        setView("EDIT_SERVICE_FUNCTION");
        selectedServiceInfo(serviceInfo);
    };

    const onAddService = () => {
        setView("EDIT_SERVICE_FUNCTION");
        selectedServiceInfo({});
    };

    const onEditAuthService = (serviceId) => {
        setView("EDIT_AUTH_FUNCTION");
        selectedAuthServiceId(serviceId);
    };

    const onAddAuthService = () => {
        setView("EDIT_SERVICE_FUNCTION");
        selectedAuthServiceId(null);
    };

    return (
        <>
            <div className="container-fluid d-flex flex-column vh-100  ">
                <Navbar
                    variant="dark"
                    style={{ backgroundColor: "#303033" }}
                    className="justify-content-end"
                >
                    <Container className="mx-0">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            className="justify-content-end"
                        >
                            <Nav>
                                <Nav.Link onClick={() => { setView("LIST_SERVICE") }} className="mx-3">
                                    Services
                                </Nav.Link>

                                <Nav.Link onClick={() => { setView("AUTH_API_LIST") }} className="mx-3">
                                    Authentication Config
                                </Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div
                    className="row flex-grow-1 overflow-hidden  "
                    style={{ backgroundColor: "#303033" }}
                >
                    {
                        view == "LIST_SERVICE" ? <ServiceList onEditService={onEditService}></ServiceList> :
                            view == "AUTH_API_LIST" ? <AuthApiList onEditAuthService={onEditAuthService}></AuthApiList> :
                                view == "EDIT_AUTH_FUNCTION" ? <EditAuthFunction selectedAuthServiceId={selectedAuthServiceId} onClose={() => { setView("AUTH_API_LIST") }} ></EditAuthFunction> :
                                    view == "EDIT_SERVICE_FUNCTION" ? <EditServiceFuntion selectedServiceInfo={selectedServiceInfo} onClose={() => { setView("LIST_SERVICE") }} ></EditServiceFuntion> :
                                        null

                    }
                </div>
            </div>
        </>
    );
}
