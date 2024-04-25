import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap';

let responseStatus = [
    {
        name: "S_201",
        label: "201",
        variant: "secondary",
    },
    {
        name: "S_403",
        label: "403",
        variant: "secondary",
    },
    {
        name: "S_500",
        label: "500",
        variant: "secondary",
    },
];

let contentTypes = [
    {
        name: "NONE",
        label: "None",
        variant: "secondary",
    },
    {
        name: "JSON",
        label: "application/json",
        variant: "secondary",
    },
    {
        name: "TEXT",
        label: "text/plain",
        variant: "secondary",
    },
    {
        name: "HTML",
        label: "text/html",
        variant: "secondary",
    },
    {
        name: "XML",
        label: "application/xml",
        variant: "secondary",
    },

];
function Response({ index,onChange, response }) {

    const [response, setResponse] = useState(response || {});

    const onValueChange = (prop, value) => {
        let r = response;
        r[prop] = value
        onChange(index, r);
    };


    return (
        <div className="mb-3 text-dark">
            <Form>
                <Form.Group>
                    <Row>
                        <Col sm={3}>
                            <Form.Label className="m-3">
                                Status
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <CustomButtonGroup
                                options={responseStatus}
                                selectedButton={response["status"]}
                                onButtonClick={onValueChange}
                                formId="status"
                                title="Response Status:"></CustomButtonGroup>

                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col sm={3}>
                            <Form.Label className="m-3">
                                Content Type
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <CustomButtonGroup
                                options={contentTypes}
                                selectedButton={response["content_type"]}
                                onButtonClick={onValueChange}
                                formId="content_type"
                                title="Content type:"></CustomButtonGroup>


                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col sm={3}>
                            <Form.Label className="m-3">
                                Schema Name:
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.Control
                                className="mx-5"
                                type="text"
                                value={response["schema_name"]}
                                onChange={(e) => onValueChange("schema_name",e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col sm={3}>
                            <Form.Label className="m-3">
                                Raw Content:
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.Control
                                className="mx-5"
                                type="text"
                                value={response["raw_content"]}
                                onChange={(e) => onValueChange("raw_content",e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col sm={3}>
                            <Form.Label className="m-3">
                                File:
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.Control
                                className="mx-5"
                                type="text"
                                value={response["file"]}
                                onChange={(e) => onValueChange("file",e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </div>
    );
}

export default Response;