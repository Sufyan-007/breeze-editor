import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import CustomButtonGroup from "../CustomButtonGroup";

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
    {
        name: "S_200",
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
function Response({ index,onChange, responseData }) {
    const [response, setResponse] = useState(responseData || {});
    console.log("resposne", response);

    const onValueChange = (prop, value) => {
        let r = response;
        r[prop] = value
        onChange(index, r);
    };
    const handleAddResponse = () => {
        setResponse([...response, {}]);
      };
    
      const handleRemoveResponse = (index) => {
        if (response.length > 1) {
          const updatedResponses = response.filter((_, i) => i !== index);
          setResponse(updatedResponses);
        //   onRemoveResponse(index); 
        }
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