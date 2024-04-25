import React, { useState, useEffect } from "react";
import {
    fetchIntermediate,
    generateReactService,
} from "../../services/IntermediatesService";
import { Table, Accordion, Button } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";

export default function ServiceLists({
    onEditService
}) {
    const [apiList, setApiList] = useState([]);

    useEffect(() => {
        fetchServiceList();
    }, []);

    const fetchServiceList = async () => {

        try {
            const result = await fetchIntermediate("creator");
            setApiList(result["files_with_apis"])
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    }

    const generateService = async (filename) => {
        try {
            const result = await generateReactService("creator", filename);
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    };


    const handleEditClick = (apiInfo) => {
        onEditService(apiInfo);
    };


    return (
        <div className="m-3">
            {apiList &&
                apiList.map((service, index) => (
                    <Accordion key={index}>
                        <Accordion.Item
                            eventKey={service.filename}
                            style={{ cursor: "pointer" }}
                        >
                            <Accordion.Header>{service.filename} <Button
                                variant="link"
                                className="mx-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    generateService(service.filename);
                                }}
                            >
                                Generate Service
                            </Button></Accordion.Header>
                            <Accordion.Body>

                                {service.apis && service.apis.length > 0 ? (
                                    <Table striped bordered hover variant="dark">
                                        <thead>
                                            <tr>
                                                <th colSpan={9} >Name</th>
                                                <th colSpan={3} >Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {service.apis.map((api, apiIndex) => (
                                                <tr key={`${api.id}`}>
                                                    <td colSpan={9}>
                                                        <div className="name-cell">{api.operation_id}</div>
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
                                                                onClick={() => handleEditClick({"id":api.id,"filename" : service.filename})}
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
                                    <h5 style={{ color: "white", textAlign: "center" }}>
                                        No services found
                                    </h5>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ))}
        </div>
    );
}
