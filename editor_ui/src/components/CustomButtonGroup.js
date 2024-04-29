import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";

const CustomButtonGroup = ({
    selectedButton,
    formId,
    title,
    options,
    onButtonClick,
}) => {
    return (
        <Form.Group controlId={{ formId }} className="mb-1">
            <Row>
                <Col sm={3}>
                    <Form.Label className="mx-3">{title}</Form.Label>
                </Col>
                <Col sm={9}>
                    <ButtonGroup style={{width: options[0].width ? options[0].width : "100%"}} className={options.className} >
                        {
                            options.map(option => {
                                return <Button
                                    variant={option.variant}
                                    onClick={() => onButtonClick(formId,option.name)}
                                    active={selectedButton === option.name}
                                >
                                    {option.label}
                                </Button>
                            })
                        }

                    </ButtonGroup>
                </Col>
            </Row>
        </Form.Group>
    );
};

export default CustomButtonGroup;