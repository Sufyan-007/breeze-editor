import { React, useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import Request from "./Request";
import Response from "./Response";
import {
  getApiConfig,
  modifyApiConfig,
  getAuthFileApis
} from "../../services/IntermediatesService";

function EditServiceFuntion({ selectedServiceInfo, onClose }) {

  const [apiModel, setApiModel] = useState({});
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);

  useEffect(() => {
    setAuthApis();
    if (selectedServiceInfo["id"] && selectedServiceInfo["filename"]) {
      fetchModelConfig(selectedServiceInfo);
    }
  }, []);

  const setAuthApis = async () => {
    const result = await getAuthFileApis("creator");
    let login_api = [];
    let token_api = [];
    if(result["data"])
    {
      for (let i= 0 ; i < result["data"].length ; i++){
        let api = result["data"][i];
        if(api["auth_api_type"] === "LOGIN"){
          login_api.push({
            "id" : api["id"],
            "operation_id" : api["operation_id"]
          })
        }
        if(api["auth_api_type"] === "REFRESH"){
          token_api.push({
            "id" : api["id"],
            "operation_id" : api["operation_id"]
          })
        }
      }
    }
    setLoginApis(login_api);
    setTokenApis(tokenApis);
  };

  const fetchModelConfig = async (selectedServiceInfo) => {
    try {
      const result = await getApiConfig("creator", selectedServiceInfo["filename"], selectedServiceInfo["id"]);
      setApiModel(result["data"])
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };

  const handleRequestBodyChange = (newData) => {
    setApiModel((prevState) => {
      return {
        ...prevState,
        request: {
          ...prevState.request,
          ...newData,
        },
      };
    });
  };

  const handleResponseBodyChange = (index, newData) => {
    let responses = apiModel["response"]
    responses[index] = newData;
    setApiModel({
      ...apiModel,
      "response" : responses
    })
  };

  const onApiModelChange = (prop, value) => {
    let model = { ...apiModel };
    model[prop] = value;
    setApiModel({
      ...model
    })
  }

  async function handleSubmit(e) {
    console.log(apiModel, "submitted");
    e.preventDefault();
    const result = await modifyApiConfig(apiModel, "creator", selectedServiceInfo["filename"]);
    setApiModel({})
    onClose()
  }
  return (
    <div>
      {apiModel && (
        <>
          <Row className="d-flex justify-content-between align-items-center w-100 mb-3">
            <Col>Edit API</Col>
            <Col md={{ span: 1 }}>
              <Button variant="secondary" onClick={handleSubmit}>
                Submit
              </Button>
            </Col>
            <Col md={{ span: 1 }}>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </Col>
          </Row>
          <Form className="mt-5">
            <>
              <Form.Group
                className="mt-3 mb-3 custom-form-group"
                controlId="operation_id"
              >
                <Row>
                  <Col sm={3}>
                    <Form.Label className="mx-3">Function Name</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={apiModel["operation_id"]}
                      onChange={(e) => { onApiModelChange("operation_id", e.target.value) }}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group
                  className="mt-3 mb-3 custom-form-group"
                  controlId="tags"
                >
                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-3">Service Name</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Row>
                        <Col sm="4">
                          <Form.Control
                            className=" custom-form-control"
                            type="text"
                            value={apiModel["tags"]}
                            onChange={(e) => { onApiModelChange("tags", e.target.value) }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group
                  className="mb-3 mt-3 custom-form-group"
                  controlId="summary"
                >
                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-3">Summary</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Form.Control
                        style={{
                          maxWidth: "50vw",
                          backgroundColor: "#222222",
                        }}
                        className="custom-form-control"
                        as="textarea"
                        rows={3}
                        value={apiModel["summary"]}
                        onChange={(e) => { onApiModelChange("summary", e.target.value) }}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </>
              {apiModel.request && (
                <Form.Group className="mb-3 custom-form-group" controlId="request">
                  <Request
                    loginApis={loginApis}
                    tokenApis={tokenApis}
                    onChange={onApiModelChange}
                    requestBody={apiModel.request}
                  />
                </Form.Group>
              )}
            
              {apiModel["response"] && (
                apiModel["response"].map((res, index) => (
                  <Response
                    index={index}
                    onChange={handleResponseBodyChange}
                    responseData={res}
                  />
                ))
              )}
            </Form>
          </>
        )}
      </div>
    );
  }
  
  export default EditServiceFuntion;
  