import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, ButtonGroup } from "react-bootstrap";

let mode = [
    {
        name: "RAW",
        label: "Raw",
        variant: "secondary",
    },
    {
        name: "FORMDATA",
        label: "Formdata",
        variant: "secondary",
    },
    {
        name: "URLENCODED",
        label: "Urlencoded",
        variant: "secondary",
    },
    {
        name: "FILE",
        label: "File",
        variant: "secondary",
    }
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

export default function Body({ index,onChange, body }) {
    const [body, setBody] = useState(body || {});
    
    const onValueChange = (prop, value) => {
        let b = body;
        b[prop] = value;
        setBody({
            ...b
        })
        onChange("request",index, b);
    };


    return (
        <div>
            <Form.Group controlId="body">
                <Row>
                    <Col sm={3}>
                        <Form.Label className="m-3">
                            Body:
                        </Form.Label>
                    </Col>
                    <Col sm={9}>
                        <div>
                            <Row>
                                <Col sm={2}>
                                    <Form.Label
                                        className="mx-5 mt-3"
                                    >
                                        Mode:
                                    </Form.Label>
                                </Col>
                                <Col sm={7}>
                                    <CustomButtonGroup
                                        options={mode}
                                        selectedButton={body["mode"]}
                                        onButtonClick={onValueChange}
                                        formId="mode"
                                        title="Mode:"></CustomButtonGroup>

                                </Col>
                            </Row>
                        </div>

                        {body.mode === "RAW" && (
                            <>
                                <div>
                                    <Row>
                                        <Col sm={2}>
                                            <Form.Label
                                                className="mx-5 mt-3"
                                            >
                                                Content Type:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={10}>
                                            <CustomButtonGroup
                                                options={contentTypes}
                                                selectedButton={body["content_type"]}
                                                onButtonClick={onValueChange}
                                                formId="content_type"
                                                title="Content type:"></CustomButtonGroup>

                                        </Col>
                                    </Row>
                                </div>

                                <div>
                                    <Row>
                                        <Col sm={2}>
                                            <Form.Label

                                                className="mx-5 mt-3"
                                            >
                                                Raw Content:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={7} className="mx-5 mt-3">
                                            <Form.Control
                                                style={{
                                                    maxWidth: "30vw",
                                                    border: "none",
                                                    backgroundColor: " #6C757D",
                                                }}
                                                type="text"
                                                value={body["raw_content"]}
                                                onChange={(e) => onValueChange("raw_content",e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )}

                        
                    </Col>
                </Row>
            </Form.Group>
           
        </div>
    );
}
