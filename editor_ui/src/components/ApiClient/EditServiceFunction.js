import { React, useState } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Dropdown,
    DropdownButton,
    Offcanvas,
} from "react-bootstrap";
import Request from "./Request";
import Response from "./Response";
import {
    fetchIntermediate,
    getApiConfig,
    modifyApiConfig
} from "../../services/IntermediatesService";

function EditServiceFuntion({ selectedServiceInfo, onClose }) {

    const [apiModel, setApiModel] = useState({});
    const [loginApis, setLoginApis] = useState([]);
    const [tokenApis, setTokenApis] = useState([]);

    useEffect(() => {
        setAuthApis()
        if (selectedServiceInfo["id"] && selectedServiceInfo["filename"]) {
            fetchModelConfig(selectedServiceInfo);
        }
    }, []);

    const setAuthApis = async () => {
        const result = await getAuthFileApis("creator");
        let login_api = [];
        let token_api = [];
        for (let i= 0 ; i < result["data"].length ; i++){
            let api = result["data"][i];
            if(api["auth_api_type"] == "LOGIN"){
                login_api.push({
                    "id" : api["id"],
                    "operation_id" : api["operation_id"]
                })
            }
            if(api["auth_api_type"] == "REFRESH"){
                token_api.push({
                    "id" : api["id"],
                    "operation_id" : api["operation_id"]
                })
            }
        }
        setLoginApis(login_api);
        setTokenApis(tokenApis);
    
    }

    const fetchModelConfig = async (selectedServiceInfo) => {

        try {
            const result = await getApiConfig("creator", selectedServiceInfo["filename"], selectedServiceInfo["id"]);
            setApiModel(result["data"])
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    }

    const handleRequestBodyChange = (newData) => {
        setRequestBody((prevState) => {
            return {
                ...prevState,
                ...newData,
            };
        });
    };
    const handleResponseBodyChange = (index,newData) => {
        let responses = apiModel["response"]
        responses[index] = newData;
        setApiModel({
            ...model,
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
        e.preventDefault();
        const result = await modifyApiConfig(apiModel, "creator", selectedServiceInfo["filename"]);
        setApiModel({})
        onClose()
    }

    return (
        <div>
            <Offcanvas
                show={show}
                onHide={() => { onClose() }}
                placement="end"
                className="custom-offcanvas"
            >
                <Offcanvas.Header>
                    <Row className="d-flex justify-content-between align-items-center w-100">
                        <Col>Edit API</Col>
                        <Col md={{ span: 1 }}>
                            <Button
                                variant="secondary"
                                className="m-1"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Col>
                        <Col md={{ span: 1 }}>
                            <Button variant="secondary" onClick={onClose()}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row className="d-flex">
                        <Col className="main-content">
                            <Form className="mt-5">

                                <>
                                    <Form.Group
                                        className="mt-3 mb-3 custom-form-group"
                                        controlId="operation_id"
                                    >
                                        <Row>
                                            <Col sm={3}>
                                                <Form.Label>Function Name</Form.Label>
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
                                                <Form.Label>Service Name</Form.Label>
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
                                                <Form.Label>Summary</Form.Label>
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

                                <Form.Group
                                    className="mb-3 custom-form-group"
                                    controlId="request"
                                >
                                    <Request
                                        loginApis={loginApis}
                                        tokenApis= {tokenApis}
                                        onChange={onApiModelChange}
                                        request={apiModel["request"]}
                                    />
                                </Form.Group>

                                {apiModel["response"] && apiModel["response"].map((res,index) => {
                                    return <Response
                                            index={index}
                                            onChange={handleResponseBodyChange}
                                            response={res}
                                        />
                                    
                                })}
                            </Form>
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
export default EditServiceFuntion;
