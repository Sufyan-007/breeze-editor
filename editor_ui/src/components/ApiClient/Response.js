import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import CustomButtonGroup from "../CustomButtonGroup";
import remove from '../../assets/icons/remove.svg'
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
        label: "Json",
        variant: "secondary",
    },
    {
        name: "TEXT",
        label: "Plain",
        variant: "secondary",
    },
    {
        name: "HTML",
        label: "Html",
        variant: "secondary",
    },
    {
        name: "XML",
        label: "Xml",
        variant: "secondary",
    },

];
function Response({ index,onChange, responseData,key,onRemove }) {
    const [response, setResponse] = useState(responseData || {});
    const onValueChange = (prop, value) => {
        let r = response;
        r[prop] = value
        onChange(index, r);
    };
    

    return (
        <Row className="mb-3 text-dark p-2" style={{ width: "45%", marginLeft: "25px"}} key={key}>
             <Col sm={1}>
        <img src={remove} height={24} alt="remove" onClick={()=> onRemove(index)} />
      </Col>
      <Col sm={11}>
      <Form.Group>
                  
                  <CustomButtonGroup
                      options={responseStatus}
                      selectedButton={response["status"]}
                      onButtonClick={onValueChange}
                      formId="status"
                      title="Status:"
                      ></CustomButtonGroup>

             
      </Form.Group>

      <Form.Group>
          
                  <CustomButtonGroup
                      options={contentTypes}
                      selectedButton={response["content_type"]}
                      onButtonClick={onValueChange}
                      formId="content_type"
                      title="Type:"></CustomButtonGroup>


            
      </Form.Group>

      <Form.Group>
          <Row>
              <Col sm={3}>
                  <Form.Label className="mx-3">
                      Schema:
                  </Form.Label>
              </Col>
              <Col sm={9}>
                  <Form.Control
                      className=""
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
                  <Form.Label className="mx-3">
                      Raw:
                  </Form.Label>
              </Col>
              <Col sm={9}>
                  <Form.Control
                      className=""
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
                  <Form.Label className="mx-3">
                      File:
                  </Form.Label>
              </Col>
              <Col sm={9}>
                  <Form.Control
                      className=""
                      type="text"
                      value={response["file"]}
                      onChange={(e) => onValueChange("file",e.target.value)}
                  />
              </Col>
          </Row>
      </Form.Group>
      </Col>
               
            
        </Row>
    );
}

export default Response;