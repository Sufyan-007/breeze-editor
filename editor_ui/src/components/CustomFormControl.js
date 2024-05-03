import React from "react";
import { Form, Row } from "react-bootstrap";
import '../css/AddOrEditAuthConfigStyles.css'
const CustomFormControl = ({
    onChange,
    controlId,
    options,
    flow_type
}) => {
    const filteredOptions = flow_type === "authorization_code" ? options : options.filter(option => option.name !== "flow.authorizationUrl");

    return (
        <Form.Group controlId={controlId} className="mt-4 d-flex">
          {filteredOptions.map((option) => (
            <Row key={option.name} className = "mx-1" style={{width: option.width ? option.width : "100%"}}>
             
                <Form.Label className="mb-2 px-2">{`${option.label}:`}</Form.Label>
             
             
              {Array.isArray(option.value) ? (
                            <Form.Control
                            style={{width:"100%"}}
                                className="mb-2 "
                                type="text"
                                value={option.value.join(", ")} 
                                onChange={(e) => onChange(option.name, e.target.value.split(",").map((element) => element.trim()))}
                            />
                        ) : (
                            <Form.Control
                            style={{width:"100%"}}
                                className="formControl mb-2"
                                type="text"
                                value={option.value || ''}
                                onChange={(e) => onChange(option.name, e.target.value)}
                            />
                        )}
            
            </Row>
          ))}
        </Form.Group>
      );
};

export default CustomFormControl;
