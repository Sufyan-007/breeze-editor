import React, { useEffect, useState } from "react";
// import "../../../css/NewResponse.css";
import '../api_client.css';
import { Form, Nav, Navbar } from "react-bootstrap";
import Remove from "../../../assets/icons/remove.svg";
function Response({ responseData, onChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const handleRemoveResponse = (index) => {
    console.log(index, "index");
    const updatedResponseData = [...responseData];
    updatedResponseData.splice(index, 1);
    console.log(updatedResponseData, "updated res data");
    onChange("response", updatedResponseData);
  };
  useEffect(() => {
    console.log(responseData, "respdaata");
  }, [responseData]);
  const handleSelect = (selectedIndex) => {
    setActiveTab(selectedIndex);
  };
  const addResponseBody = () => {
    const newResp = {
      content_type: "TEXT",
      status: "S_200",
      schema_name: null,
      schema: {},
      raw_content: "",
      file: "",
      description: "",
    };
    const updatedResp = [...responseData, newResp];
    onChange("response", updatedResp);
    setActiveTab(updatedResp.length - 1);
  };
  const handleChange = (prop, value) => {
    const updatdResp = [...responseData];
    updatdResp[activeTab][prop] = value;
    onChange("response", updatdResp);
  };
  return (
    <div className="api-client-h-full api-client-w-full api-client-d-flex">
      <div
        id="left-response"
        className="api-client-h-full api-client-w-50 api-client-border-white">
        <h6 className="api-client-color-white mx-2 mt-2">Custom Response</h6>
        <div id="top-panel" className="api-client-w-full  api-client-h-15">
          <Navbar bg="dark" variant="dark" className="api-client-h-full">
            <Nav activeKey={activeTab} onSelect={handleSelect}>
              {responseData.map((response, index) => (
                <Nav.Link key={index} eventKey={index}>
                  {response.content_type ? response.content_type : null}
                  <img
                    className="mx-2 mb-1"
                    width="20"
                    height="20"
                    src={Remove}
                    alt="remove"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveResponse(index)}
                  />
                </Nav.Link>
              ))}
              <img
                className="mt-2"
                width="24"
                height="24"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{ cursor: "pointer" }}
                onClick={addResponseBody}
              />
            </Nav>
          </Navbar>
        </div>
        <div
          id="response-settings"
          className="api-client-w-full api-client-h-80 ">
          {activeTab && responseData.length > 0 && (
            <>
              <div className="api-client-h-full api-client-d-flex  mt-2">
                <div id="left" className="api-client-h-full api-client-w-50 ">
                  <div
                    id="left-first"
                    className="api-client-w-full api-client-h-20 mt-1">
                    <Form.Label className="api-client-color-white mt-2 mx-2 api-client-w-35">
                      Status :
                    </Form.Label>
                    <Form.Select
                      className="api-client-response-form-control mx-2"
                      value={
                        responseData[activeTab]
                          ? responseData[activeTab].status
                          : ""
                      }
                      onChange={(e) => {
                        handleChange("status", e.target.value);
                      }}>
                      <option value="S_200">S_200</option>
                      <option value="S_400">S_400</option>
                      <option value="S_201">S_201</option>
                      <option value="S_500">S_500</option>
                      <option value="S_404">S_404</option>
                    </Form.Select>
                  </div>
                  <div
                    id="left-second"
                    className="api-client-w-full api-client-h-20 mt-1">
                    <Form.Label className="api-client-color-white mt-2 mx-2 api-client-w-35">
                      Content Type :
                    </Form.Label>
                    <Form.Select
                      className="api-client-response-form-control mx-2"
                      value={
                        responseData[activeTab]
                          ? responseData[activeTab].content_type
                          : ""
                      }
                      onChange={(e) => {
                        handleChange("content_type", e.target.value);
                      }}>
                      <option value="TEXT">TEXT</option>
                      <option value="HTML">HTML</option>
                      <option value="JSON">JSON</option>
                    </Form.Select>
                  </div>
                  <div
                    id="left-third"
                    className="api-client-w-full api-client-h-20 mt-1">
                    <Form.Label className="api-client-color-white mt-2 mx-2 api-client-w-35">
                      Schema Name :
                    </Form.Label>
                    <Form.Select
                      className="api-client-response-form-control mx-2"
                      value={
                        responseData[activeTab]
                          ? responseData[activeTab].schema_name
                          : ""
                      }
                      onChange={(e) => {
                        handleChange("schema_name", e.target.value);
                      }}>
                      <option value="PET">PET</option>
                      <option value="USER">USER</option>
                      <option value="STORE">STORE</option>
                    </Form.Select>
                  </div>
                </div>

                <div id="right" className="api-client-h-full api-client-w-50">
                  <div
                    id="right-first"
                    className="api-client-w-full api-client-h-20 mt-1">
                    <Form.Label className="api-client-color-white mt-2 api-client-w-35">
                      Raw Content :
                    </Form.Label>
                    <Form.Control
                      className="api-client-response-form-control"
                      type="text"
                      placeholder="Key"
                      value={
                        responseData[activeTab]
                          ? responseData[activeTab].raw_content
                          : ""
                      }
                      onChange={(e) => {
                        handleChange("raw_content", e.target.value);
                      }}
                    />
                  </div>
                  <div
                    id="right-second"
                    className="api-client-w-full api-client-h-20 mt-1">
                    <Form.Label className="api-client-color-white mt-2 api-client-w-35">
                      Description :
                    </Form.Label>
                    <Form.Control
                      className="api-client-response-form-control"
                      type="text"
                      placeholder="Key"
                      value={
                        responseData[activeTab]
                          ? responseData[activeTab].description
                          : ""
                      }
                      onChange={(e) => {
                        handleChange("description", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        id="right-response"
        className="api-client-h-full api-client-w-50 api-client-border-white">
        <h6 className="api-client-color-white mx-2 mt-2">Retrieved Response</h6>
      </div>
    </div>
  );
}

export default Response;
