import { React, useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Request from "./Request";
import Response from "./Response";
import {
  getApiConfig,
  modifyApiConfig,
  getAuthFileApis,
} from "../../services/IntermediatesService";
import { useParams } from "react-router";
import add from "../../assets/icons/add.svg";
import ServiceEditcss from "../../css/ServiceEdit.css";
import CustomFormGroup from "../CustomFormGroup.js";

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

  const controls = [
    {
      label: "Function Name",
      type: "text",
      value: apiModel ? apiModel["operation_id"] : "",
      onChange: (value) =>
        onApiModelChange("operation_id", value)
      ,
      placeholder: "Enter Function Name",
      width: "90%",
      labelColWidth: 3,
      inputColWidth: 9,
    },
    {
      label: "Service Name",
      type: "text",
      value: apiModel ? apiModel["tags"] : "",
      onChange: (value) => {
        onApiModelChange("tags",value);
      },
      placeholder: "enter service name",
      width: "90%",
      labelColWidth: 3,
      inputColWidth: 9,
    },
    {
      label: "Summary",
      type: "textarea",
      value: apiModel ? apiModel["summary"] : "",
      onChange: (value) => {
        onApiModelChange("summary",value);
      },
      placeholder: "Enter summary",
      labelColWidth: 3,
      inputColWidth: 9,
    }
  ];

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
      id: Date.now(),
    };
    setApiModel({
      ...apiModel,
      response: apiModel.response
        ? [...apiModel.response, newResponse]
        : [newResponse],
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
    console.log(prop, value , "text change in edit service");
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
          <div className="custom-grid d-flex justify-content-end align-items-center w-100 mb-3">
            <div className="custom-grid-item one">
              <Button variant="secondary" onClick={handleSubmit} label="Submit">
                Submit
              </Button>
            </div>
            <div className="custom-grid-item one">
              <Button variant="secondary" onClick={onClose} label="Close">
                Close
              </Button>
            </div>
          </div>
          <Form className="mt-4">
            <CustomFormGroup controls={controls} />

            <section className="divider-sec">
              <p>Request Body</p>
            </section>
            {
              <Form.Group
                className="mb-3 custom-form-group"
                controlId="request"
              >
                <Request
                  loginApis={loginApis}
                  tokenApis={tokenApis}
                  onChange={onApiModelChange}
                  requestBody={apiModel.request || {"auth":[], "body":[]}}
                />
              </Form.Group>
            }

            <section className="divider-sec">
              <p>Response Body</p>
            </section>

            {
              <div className="custom-grid">
                <div className="custom-grid-item three">
                  <Form.Label className="mx-3 mt-3">Response</Form.Label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddResponse}
                  >
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                      alt="add--v1"
                    />
                  </Button>
                </div>
                <div
                  className="custom-grid-item nine d-flex flex-wrap mt-3 p-2"
                  
                >
                  {apiModel["response"]&& apiModel["response"].map((res, index) => (
                    <Response
                      key={res.id}
                      index={index}
                      onChange={handleResponseBodyChange}
                      responseData={res}
                      onRemove={removeResponse}
                    />
                  ))}
                </div>
              </div>
            }
          </Form>
        </>
    </div>
  );
}

export default EditServiceFuntion;
