import React, { useState, useEffect } from "react";
import {
    fetchIntermediate,
    generateReactService
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

    useEffect(() => {
        console.log("in service list");
        fetchServiceList();
    }, []);
    const appName = useParams()

    const fetchServiceList = async () => {

        try {
            const result = await fetchIntermediate(appName.projectName);
            setApiList(result["files_with_apis"])
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    }

    const generateService = async (filename) => {
        try {
            const result = await generateReactService(appName.projectName, filename);
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    };


    const handleEditClick = (apiInfo) => {
        onEditService(apiInfo);
    };
    console.log(apiList,"api list in service list comp ");

return (
    <div className="main-div m-5 ">
        {apiList.length >0 ?
            apiList.map((service, index) => (
                <Accordion key={index}>
                    <Accordion.Item
                        eventKey={service.filename}
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
                                                            className=" edit-icon m-1"
                                                            src={EditIcon}
                                                            alt="Edit"
                                                            onClick={() => handleEditClick({ "id": value.id, "filename": service.filename })}
                                                        />
                                                        <img
                                                        className="delete-icon"
                                                            src={DeleteIcon}
                                                            alt="Delete"
                                        
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <h5 className="h5">
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
