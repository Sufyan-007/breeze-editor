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
        <Form.Group controlId={{ formId }} className="mt-4">
            <Row>
                <Col sm={3}>
                    <Form.Label className="m-3">{title}</Form.Label>
                </Col>
                <Col sm={9}>
                    <ButtonGroup className="mx-5">
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