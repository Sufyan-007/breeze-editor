import { React, useEffect, useState, useCallback } from "react";

import './temp.css'; // Import CSS file for styling
import { getStateVars } from "../../services/ComponentReadService";
import { useParams } from "react-router";

import { Dropdown, Container, Row, Col, Table } from "react-bootstrap";
import {
    getApiConfig,
    fetchIntermediate
} from "../../services/IntermediatesService";
const initialJsonData = {
    "properties": {
        "name": {
            "type": "string",
            "value": ""
        },
        "description": {
            "type": "string",
            "value": ""
        },
        "path": {
            "type": "string",
            "value": ""
        },
        "author": {
            "type": "string",
            "value": ""
        },
        "defaultComponent": {
            "type": "string",
            "value": ""
        },
        "nested": {
            "type": "object",
            "value": {
                "nestedProp1": "",
                "nestedProp2": 0
            }
        }
    }
};

function MapperField({ props }) {
    const [schemaJson, setSchemaJson] = useState({});
    const [stateVars, setStateVars] = useState({});
    const [selectedFile, setSelectdFile] = useState(null);
    const [selectedApi, setSelectedApi] = useState(null);

    const [apiList, setApiList] = useState({});

    // const [selectedServiceInfo, setSelectedApiInfo] = useState({
    //     "filename": "Config",
    //     "id": "7865eb16_a5c0_428d_b61b_3b5a7a1f1974"
    // })
    const appName = useParams();
    const fetchServiceList = async () => {
        try {
            const result = await fetchIntermediate(appName.projectName);
            console.log(result);
            let data = {}
            for (let i = 0; i < result["files_with_apis"].length; i++) {
                data[result["files_with_apis"][i]["filename"]] = result["files_with_apis"][i]["apis"];
            }
            setApiList(data);
        } catch (error) {
            console.error("Error generate react service:", error);
        }
    };

    const fetchStateVarsApi = async () => {
        let rs = await getStateVars("creator", "CreateAppPage");
        setStateVars({ ...rs.data });
        console.log(rs);
    };

    const fetchSchemaApi = async () => {
        if (selectedApi && selectedApi["id"]) {
            const result = await getApiConfig(
                appName.projectName,
                selectedFile,
                selectedApi["id"]
            );
            const updatedModel = result["data"];
            const body = updatedModel["request"]["body"];
            body.map(cn => {
                if (cn["content_type"] == "JSON") {
                    setSchemaJson(cn["schema"])
                }
            })
        }

    };

    useEffect(() => {
        fetchServiceList()
        fetchStateVarsApi();
    }, [])

    useEffect(() => {
        fetchSchemaApi();
    }, [selectedFile, selectedApi])

    const handleInputChange = (key, value, nestedKey) => {
        const updatedJsonData = { ...schemaJson };
        if (nestedKey) {
            updatedJsonData["properties"][key].value[nestedKey] = value;
        } else {
            updatedJsonData["properties"][key].value = value;
        }
        setSchemaJson(updatedJsonData)
    };

    const onFileChange = (name) => {
        setSelectdFile(name);
        setSelectedApi(null);
        setSchemaJson({})
    }

    const renderProperties = (properties) => {
        return Object.entries(properties).map(([key, value]) => {
            if (value.type === "object" && value.value) {
                return (
                    <tr key={key}>
                        <td colSpan={9}>
                            <div className="name-cell">
                                {key}:
                            </div>
                        </td>
                        <td>
                            {Object.entries(value.value).map(([nestedKey, nestedValue]) => (
                                <tr >
                                    <td style={{ "color": "aliceblue" }} xs={3}>
                                        {nestedKey}
                                    </td>
                                    <td>

                                        <Dropdown className="mx-5">
                                            <Dropdown.Toggle variant="secondary">
                                                {nestedValue ? nestedValue : "Select an option"}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{ textAlign: "center" }}>
                                                {Object.keys(stateVars).map((variable) => (
                                                    <Dropdown.Item
                                                        key={variable}
                                                        eventKey={variable}
                                                        className="dropdownitem"
                                                        onClick={() => handleInputChange(key, variable, nestedKey)}
                                                    >
                                                        {variable}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}

                        </td>
                    </tr>

                );
            } else {
                return (
                    <tr key={key}>
                        <td colSpan={9}>
                            <div className="name-cell">
                                {key}:
                            </div>
                        </td>
                        <td>
                            <Dropdown className="mx-5">
                                <Dropdown.Toggle variant="secondary">
                                    {value.value ? value.value : "Select an option"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ textAlign: "center" }}>
                                    {Object.keys(stateVars).map((variable) => (
                                        <Dropdown.Item
                                            key={variable}
                                            eventKey={variable}
                                            className="dropdownitem"
                                            onClick={() => handleInputChange(key, variable)}
                                        >
                                            {variable}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>

                );
            }
        });

    }

    return (
        <div className="container">
            <Container fluid>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>
                                <Dropdown className="mx-5">
                                    <Dropdown.Toggle variant="secondary">
                                        {selectedFile || "Filename"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ textAlign: "center" }}>
                                        {Object.keys(apiList).map((variable) => (
                                            <Dropdown.Item
                                                key={variable}
                                                eventKey={variable}
                                                className="dropdownitem"
                                                onClick={() => onFileChange(variable)}
                                            >
                                                {variable}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </th>

                            <th>
                                <Dropdown className="mx-5">
                                    <Dropdown.Toggle variant="secondary">
                                        {selectedApi ? selectedApi["operation_id"] : "Function Name"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ textAlign: "center" }}>
                                        {Object.keys(apiList[selectedFile] || {}).map((variable) => (
                                            <Dropdown.Item
                                                key={variable}
                                                eventKey={variable}
                                                className="dropdownitem"
                                                onClick={() => setSelectedApi(apiList[selectedFile][variable])}
                                            >
                                                {apiList[selectedFile][variable]["operation_id"]}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </th>

                        </tr>
                    </thead>

                </Table>
                <Table striped bordered hover variant="dark">

                    <thead>
                        <tr>
                            <th colSpan={9}>Property Name</th>

                            <th colSpan={3}>Mapped with</th>
                        </tr>
                    </thead>
                    <tbody>

                        {renderProperties(schemaJson.properties || {})}
                    </tbody>
                </Table>
            </Container>
        </div>
    );

}

export default MapperField;