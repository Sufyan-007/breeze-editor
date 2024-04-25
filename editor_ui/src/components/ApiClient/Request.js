import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Auth from "./Auth.js";

let methodType = [
    {
        name: "GET",
        label: "Get",
        variant: "secondary",
    },
    {
        name: "POST",
        label: "Post",
        variant: "secondary",
    },
    {
        name: "PUT",
        label: "Put",
        variant: "secondary",
    },
    {
        name: "DELETE",
        label: "Delete",
        variant: "secondary",
    }
];
function Request({loginApis,tokenApis, onChange, requestBody }) {

    const [request, setRequest] = useState(requestBody || {});

    
    const onUrlValueChange = (value) => {
        let r = request;
        r["url"]["path"] = value;
        setRequest({
            ...r
        })
        onChange("request", r);
    }
    const onListValueChange = (prop,index,data) => {
        let r = request;
        r[prop][index] = data;
        setRequest({
            ...r
        })
        onChange("request", r);
    }

    const onValueChange = (prop, value) => {
        let r = request;
        r[prop] = value;
        setRequest({
            ...r
        });
        onChange("request", r);
    };


    return (
        <div>
            <div className="mb-3 text-dark requestbody">
                <Form>
                    <Form.Group controlId="method">
                        <Row>
                            <Col sm={3}>
                                <Form.Label className="m-3">HTTP Method:</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <CustomButtonGroup
                                    options={methodType}
                                    selectedButton={request["method"]}
                                    onButtonClick={onValueChange}
                                    formId="method"
                                    title="Method:"></CustomButtonGroup>

                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="url">
                        <Row>
                            <Col sm={3}>
                                <Form.Label className="m-3">Url:</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <Form.Control
                                    className="mx-5"
                                    type="text"
                                    value={request["url"]["path"]}
                                    onChange={(e) => onUrlValueChange(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    {
                        request["auth"] && request["auth"].map((auth, index) => {
                        return <Auth
                            index={index}
                            onChange={onListValueChange}
                            auth={auth}
                            tokenApis={tokenApis}
                            loginApis={loginApis}
                        />

                    })}
                    
                    {request["body"] && request["body"].map((body, index) => {
                        return <Body
                            index={index}
                            onChange={onListValueChange}
                            body={body}
                        />

                    })}
                    
                </Form>
            </div>
        </div>
    );
}

export default Request;
