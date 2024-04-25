import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, ButtonGroup } from "react-bootstrap";
let authTypes = [
    {
        name: "NOAUTH",
        label: "No Auth",
        variant: "secondary",
    },
    {
        name: "BASIC",
        label: "Basic",
        variant: "secondary",
    },
    {
        name: "OAUTH2",
        label: "Oauth2",
        variant: "secondary",
    },
    {
        name: "BEARER",
        label: "Bearer",
        variant: "secondary",
    }
];

export default function Auth({ index, onChange, auth ,loginApis ,tokenApis }) {
    const [auth, setAuth] = useState(auth || {});

    const onValueChange = (prop, value) => {
        let au = auth;
        au[prop] = value;
        setAuth({
            ...au
        })
        onChange("auth", index, b);
    };
    const handleAuthApiSelect = (api,prop) => {
        let au = auth;
        au[prop] = api["id"];
        setAuth({
            ...au
        })
        onChange("auth", index, b);
    }

    return (
        <div>
            <Form.Group controlId="aut">
                <Row>
                    <Col sm={3}>
                        <Form.Label className="m-3">
                            Auth:
                        </Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Row>
                            <Col sm={2}>
                                <Form.Label
                                    className="mx-5 mt-3"
                                >
                                    Type:
                                </Form.Label>
                            </Col>
                            <Col sm={7}>
                                <CustomButtonGroup
                                    options={authTypes}
                                    selectedButton={auth["type"]}
                                    onButtonClick={onValueChange}
                                    formId="type"
                                    title="Type:"></CustomButtonGroup>

                            </Col>
                        </Row>



                    </Col>
                </Row>
            </Form.Group>
            <Form.Group
                className="mt-3 mb-3 custom-form-group"
                controlId="login_api"
            >
                <Row>
                    <Col sm={3}>
                        <Form.Label>Login Api</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Dropdown
                            onSelect={(api) => handleAuthApiSelect(api, "login_api")}
                            className="m-2"
                        >
                            <Dropdown.Toggle
                                variant="secondary"
                                id="loginApiDropdown"
                            >
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ textAlign: "center" }}>
                                {loginApis.map((api) => (
                                    <Dropdown.Item
                                        key={api.id}
                                        eventKey={api}
                                        className="dropdownitem"
                                    >
                                        {api.operation_id}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group
                className="mt-3 mb-3 custom-form-group"
                controlId="token_api"
            >
                <Row>
                    <Col sm={3}>
                        <Form.Label>Token Api</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Dropdown
                            onSelect={(api) => handleAuthApiSelect(api, "token_api")}
                            className="m-2"
                        >
                            <Dropdown.Toggle
                                variant="secondary"
                                id="loginApiDropdown"
                            >
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ textAlign: "center" }}>
                                {tokenApis.map((api) => (
                                    <Dropdown.Item
                                        key={api.id}
                                        eventKey={api}
                                        className="dropdownitem"
                                    >
                                        {api.operation_id}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form.Group>

        </div>
    );
}
