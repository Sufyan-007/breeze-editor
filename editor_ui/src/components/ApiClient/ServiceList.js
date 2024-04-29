import React, { useState, useEffect } from "react";
import {
    callApiClientGenerator
} from "../../services/IntermediatesService";
import { Table, Accordion, Button, Alert } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";
import "../../css/ServiceList.css"
import { useParams } from "react-router";
export default function ServiceLists({
    onEditService, errorMessage
}) {
    const [apiList, setApiList] = useState([]);
    const appName = useParams()
    useEffect(() => {
        console.log("in service list");
        fetchServiceList();
    }, []);

    const fetchServiceList = async () => {

        try {
            const result = await callApiClientGenerator("http://localhost:8000/api-client-generator/fetch-all-intermediates/creator/false", "GET", null, false,{})
            setApiList(result["files_with_apis"])
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    }
    const generateService = async (filename) => {
        try {
            let path = "ORDINARY"
            if (filename === "auth.json"){
                path = "AUTH"
            }
            let file = filename.split(".")[0];
            const apiUrl = "http://localhost:8000/api-client-generator/generate-react-api-client/"+path
            const res = await callApiClientGenerator(apiUrl,"POST", {"appName": appName.projectName, "filename":file},false, {})
            // const result = await generateReactService("creator", filename);
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    };


    const handleEditClick = (apiInfo) => {
        onEditService(apiInfo);
    };

return (
    <div className="m-5" style={{width:"95%"}}>
        {apiList.length >0 ?
            apiList.map((service, index) => (
                <Accordion key={index}>
                    <Accordion.Item
                        eventKey={service.filename}
                        style={{ cursor: "pointer" }}
                    >
                        <Accordion.Header>
                            {service.filename}{" "}
                            <Button
                                variant="link"
                                className="mx-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    generateService(service.filename);
                                }}
                            >
                                Generate Service
                            </Button>
                        </Accordion.Header>
                        <Accordion.Body>
                            {service.apis && Object.keys(service.apis).length > 0 ? (
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th colSpan={9}>Name</th>
                                            <th colSpan={3}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(service.apis).map(([key, value]) => (
                                            <tr key={key}>
                                                <td colSpan={9}>
                                                    <div className="name-cell">
                                                        {value.operation_id}
                                                    </div>
                                                </td>
                                                <td colSpan={3}>
                                                    <div className="actions-cell">
                                                        <img
                                                            className="m-1"
                                                            src={EditIcon}
                                                            alt="Edit"
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "20px",
                                                                height: "20px",
                                                            }}
                                                            onClick={() => handleEditClick({ "id": value.id, "filename": service.filename })}
                                                        />
                                                        <img
                                                            src={DeleteIcon}
                                                            alt="Delete"
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "20px",
                                                                height: "20px",
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <h5 style={{ color: "black", textAlign: "center" }}>
                                    No services found
                                </h5>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ))
        : errorMessage ? (
            <Alert className="error-message" variant="warning">{errorMessage}</Alert>
        ) : (
            <>
            </>
        )}
    </div>
);

}
