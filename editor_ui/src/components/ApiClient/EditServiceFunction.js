import { React, useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Request from "./Request";
import Response from "./Response";
import {
  getApiConfig,
  modifyApiConfig,
  getAuthFileApis,
} from "../../services/IntermediatesService";
import { useParams } from "react-router";

function EditServiceFuntion({ selectedServiceInfo, onClose }) {
  const [apiModel, setApiModel] = useState({});
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);
  const appName = useParams();
  useEffect(() => {
    setAuthApis();
    if (selectedServiceInfo["id"] && selectedServiceInfo["filename"]) {
      fetchModelConfig(selectedServiceInfo);
    }
  }, []);

  const setAuthApis = async () => {
    const result = await getAuthFileApis(appName.projectName, null);
    let login_api = [];
    let token_api = [];
    if (!Array.isArray(result.data)) {
      console.error("Data is not an array:", result.data);
      return;
    }
    console.log(result.data, "result data ");
    for (let i = 0; i < result["data"].length; i++) {
      let api = result.data[i];
      if (api.auth_api_type === "LOGIN") {
        login_api.push({
          id: api["id"],
          operation_id: api.operation_id,
        });
      }
      if (api.auth_api_type === "REFRESH") {
        token_api.push({
          id: api["id"],
          operation_id: api.operation_id,
        });
      }
    }
    setLoginApis(login_api);
    setTokenApis(token_api);
    console.log(login_api, "login api", token_api, " token apis");
  };
  const fetchModelConfig = async (selectedServiceInfo) => {
    try {
      const result = await getApiConfig(
        appName.projectName,
        selectedServiceInfo["filename"],
        selectedServiceInfo["id"]
      );
      const updatedModel = result["data"];
      if (updatedModel.response && updatedModel.response.length > 0) {
        const updatedRes = updatedModel.response.map((res) => ({
          ...res,
          id: Date.now() + Math.random(),
        }));
        updatedModel.response = updatedRes;
      }
      setApiModel(updatedModel);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };

  const handleResponseBodyChange = (index, newData) => {
    let responses = apiModel["response"];
    responses[index] = newData;
    setApiModel({
      ...apiModel,
      response: responses,
    });
  };
  const handleAddResponse = () => {
    const newResponse = {
      id: Date.now()
    };
    setApiModel({
      ...apiModel,
      response: apiModel.response
        ? [...apiModel.response, newResponse]
        : [newResponse]
    });
  };
  const removeResponse = (indexToRemove) => {
    if (apiModel.response && apiModel.response.length > 0) {
      const updatedRes = apiModel.response.filter(
        (_, index) => index !== indexToRemove
      );
      setApiModel((prevState) => ({
        ...prevState,
        response: updatedRes,
      }));
    }
  };
  const onApiModelChange = (prop, value) => {
    let model = { ...apiModel };
    model[prop] = value;
    setApiModel({
      ...model,
    });
  };

  async function handleSubmit(e) {
    console.log(apiModel, "submitted");
    let operation = "ADD";
    if(apiModel.id){
      operation = "UPDATE"
    }
    e.preventDefault();
    const result = await modifyApiConfig(
      apiModel,
      appName.projectName,
      selectedServiceInfo["filename"] ? selectedServiceInfo["filename"] : apiModel["tags"],
      operation
    );
    setApiModel({});
    onClose();
  }
  return (
    <div>
        <>
          <Row className="d-flex justify-content-between align-items-center w-100 mb-3">
            <Col></Col>
            <Col md={{ span: 1 }}>
              <Button
                variant="secondary"
                onClick={handleSubmit}
                className="my-3">
                Submit
              </Button>
            </Col>
            <Col md={{ span: 1 }}>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </Col>
          </Row>
          <Form className="mt-4">
            <>
              <Form.Group
                className="mt-3 mb-3 custom-form-group"
                controlId="operation_id">
                <Row>
                  <Col sm={3}>
                    <Form.Label className="mx-3">Function Name</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      style={{ width: "100%" }}
                      type="text"
                      value={apiModel["operation_id"]}
                      onChange={(e) => {
                        onApiModelChange("operation_id", e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group
                className="mt-3 mb-3 custom-form-group"
                controlId="tags">
                <Row>
                  <Col sm={3}>
                    <Form.Label className="mx-3">Service Name</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      style={{ width: "100%" }}
                      className=" custom-form-control"
                      type="text"
                      value={apiModel["tags"]}
                      onChange={(e) => {
                        onApiModelChange("tags", e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group
                className="mb-3 mt-3 custom-form-group"
                controlId="summary">
                <Row>
                  <Col sm={3}>
                    <Form.Label className="mx-3">Summary</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      style={{
                        width: "100%",
                      }}
                      className="custom-form-control"
                      as="textarea"
                      rows={3}
                      value={apiModel["summary"]}
                      onChange={(e) => {
                        onApiModelChange("summary", e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </>

            <Form.Group className="mb-3 custom-form-group" controlId="request">
               <Request
                loginApis={loginApis}
                tokenApis={tokenApis}
                onChange={onApiModelChange}
                requestBody={
                  apiModel.request || {"body":[], "auth":[]}
                }
              /> 
            </Form.Group>

            <Row>
              <Col sm={3}>
                <Form.Label className="mx-3 mt-3">Response</Form.Label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddResponse}>
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                    alt="add--v1"
                  />
                </Button>
              </Col>
              <Col
                sm={9}
                className="d-flex flex-wrap mt-3 p-2"
                style={{ backgroundColor: "rgba(239, 239, 239, 0.5)" }}>
                {apiModel.response &&
                  apiModel["response"].map((res, index) => (
                    <Response
                      key={res.id}
                      index={index}
                      onChange={handleResponseBodyChange}
                      responseData={res}
                      onRemove={removeResponse}
                    />
                  ))}
              </Col>
            </Row>
          </Form>
        </>
    </div>
  );
}

export default EditServiceFuntion;
