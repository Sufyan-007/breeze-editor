import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import RenderObject from "../EditView/RenderObject";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import edit from "../../../../../assets/icons/edit-icon.svg";
import { getApiSchemaDetails } from "../../../services/ApiService";
import { useParams } from "react-router";
import {
  addSchema,
  deleteSchema,
  editSchema,
} from "../../../services/SchemaService";

function SchemaSettings() {
  const [defaultSchemaObj, setDefaultSchemaObj] = useState({
    type: "object",
    properties: {},
    required: [],
    name: "",
  });
  const [id, setId] = useState();
  const [module, setModule] = useState(null);
  const [schemaList, setSchemaList] = useState([]);
  const [expandedModule, setExpandedModule] = useState([]); 
  const { projectName } = useParams();

  const fetchSchemasList = useCallback(
    async (schemaId, module_id) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaId, module_id,);
        if (schemaId && module_id) {
          return result;
        } else {
          setSchemaList(result);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [projectName]
  );
  const handleModuleSelect = (event) => {
    const selectedOption = event.target.selectedOptions[0];
    const moduleName = selectedOption.dataset.name;
    const moduleId = selectedOption.dataset.id;
    setModule({ "name": moduleName, "id": moduleId });
  }
  useEffect(() => {
    fetchSchemasList(null, null);
  }, [fetchSchemasList]);

  const addProperty = () => {
    setId(null)
    const newPropertyKey = `property${Object.keys(defaultSchemaObj.properties).length + 1}`;
    const newProperty = {
      type: "",
      required: false,
      example: "",
      objectType: "",
    };

    setDefaultSchemaObj({
      ...defaultSchemaObj,
      properties: {
        ...defaultSchemaObj.properties,
        [newPropertyKey]: newProperty,
      },
    });
  };

  const editProperty = (key, newValue, newKey) => {
    if (newValue) {
      if (newKey) {
        setDefaultSchemaObj((state) => {
          delete state.properties[key];
          state.properties[newKey] = newValue;
          return { ...state };
        });
      } else {
        setDefaultSchemaObj((state) => {
          state.properties[key] = newValue;
          return { ...state };
        });
      }
    } else {
      setDefaultSchemaObj((prevState) => {
        delete prevState.properties[key];
        return { ...prevState };
      });
    }
  };

  const onSubmit = async (e) => {
    if(!module){
      alert("Please select a module.");
      return;
    }
    e.preventDefault();
    const finalSchema = { id, details: defaultSchemaObj };
    const operation = id ? "edit" : "add";
    if (operation === "add") {
      const result = await addSchema(projectName, finalSchema, module.id);
      if (result.message) {
        fetchSchemasList(null, null);
      }
    } else {
      const result = await editSchema(projectName, finalSchema, id, module.id);
      if (result.message) {
        fetchSchemasList(null, null);
      }
    }
  };

  const handleSchemaOperations = async (operation, schema, module_id, module_name) => {
    if (operation === "edit") {
      setId(schema.id);
      setModule({"id": module_id, "name": module_name})
      const details = await fetchSchemasList(schema.id, module_id);
      setDefaultSchemaObj(details);
    } else if (operation === "delete") {
      const result = await deleteSchema(projectName, schema.id, module_id);
      if (result.message) {
        fetchSchemasList(null, null);
      }
    }
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModule((prevExpandedModule) => {
      if (prevExpandedModule.includes(moduleId)) {
        return prevExpandedModule.filter((id) => id !== moduleId);
      } else {
        return [...prevExpandedModule, moduleId];
      }
    });
  };
  return (
    defaultSchemaObj && (
      <Row id="main" className="container-fluid h-100">
        <Col
          sm={2}
          className="h-100"
          id="left-panel"
          style={{
            backgroundColor: "#212529",
            borderRight: "1px solid rgba(128, 128, 128, 0.5)",
          }}>
          <div className="text-white mt-2 d-flex justify-content-between">
            <strong>Schemas</strong>
          </div>
          {schemaList.length > 0 ? (
            <div>
              {schemaList.map((module) => (
                <div key={module.module_id} className="text-white mt-2">
                  <div
                    className="d-flex my-3"
                    onClick={() => toggleModuleExpand(module.module_id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: expandedModule.includes(module.module_id)
                        ? "#303033"
                        : "#212529"
                    }}
                  >
                    <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/module.png" alt="module"  className="mt-1"/>
                    <span className="overflow-auto mx-2">{module.title}</span>
                  </div>
                  {expandedModule.includes(module.module_id) && (
                    <div className="">
                      {module.schemas.map((schema) => (
                        <div key={schema.id} className="d-flex justify-content-between mt-1">
                          <span className="text-white mx-2">{schema.name}</span>
                          <div className="d-flex">
                            <img
                              src={edit}
                              alt="edit"
                              height={20}
                              width={20}
                              style={{ cursor: "pointer" }}
                              className="mx-1"
                              onClick={() => handleSchemaOperations("edit", schema, module.module_id, module.title)}
                            />
                            <img
                              src={Delete}
                              alt="delete"
                              height={20}
                              width={20}
                              style={{ cursor: "pointer" }}
                              className="mx-1"
                              onClick={() => handleSchemaOperations("delete", schema, module.module_id, module.title)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h5 className="no-service text-white">No schemas found</h5>
          )}
        </Col>
        <Col sm={10} id="right-panel">
          <div className="d-flex justify-content-between">
            <h6 className="text-white mt-4">Schema Configuration</h6>
            <div className="d-flex align-items-center">
              <Form.Select
                aria-label="Select Module"
                className="rounded-0 mx-2 mt-3 text-white"
                defaultValue=""
                style={{ "backgroundColor": "#6c757d", "border": "none", "color": "white" }}
                onChange={(e) => handleModuleSelect(e)}
              >
                <option value="" data-name="" data-id="">
                  Select Module
                </option>
                {schemaList && schemaList.length > 0 ? (
                  schemaList.map((schema, index) => (
                    <option
                      className="text-white"
                      key={index}
                      value={schema.title}
                      data-name={schema.title}
                      data-id={schema.module_id}
                    >
                      {schema.title}
                    </option>
                  ))
                ) : (
                  <option value="" data-name="" data-id="">
                    No modules available
                  </option>
                )}
              </Form.Select>
              <Button
                variant="secondary"
                className="rounded-0 mt-3"
                onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </div>

          <Row className="mb-2 mt-4">
            <Col sm={3} className="text-white">
              Schema Name:
            </Col>
            <Col sm={9}>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="Value"
                value={defaultSchemaObj.name}
                onChange={(e) =>
                  setDefaultSchemaObj({
                    ...defaultSchemaObj,
                    name: e.target.value,
                  })
                }
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2 mt-2 d-flex ">
            <div
              className="text-white p-1"
              style={{ backgroundColor: "#303033" }}>
              <span className="mx-2">Properties</span>
              <img
                className="mx-1"
                width="25"
                height="25"
                src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                alt="add--v1"
                onClick={addProperty}
                style={{ cursor: "pointer" }}
              />
            </div>
          </Row>
          {defaultSchemaObj.properties &&
            Object.entries(defaultSchemaObj.properties).map(([key, value]) => (
              <RenderObject
                key={key}
                propertyName={key}
                value={value}
                updateParent={(value, newKey = null) =>
                  editProperty(key, value, newKey)
                }
                schemaList={schemaList}
              />
            ))}

          <Row className="mb-2 mt-4 mx-2 h-50 " style={{ border: "1px solid white" }}>
            <span className="text-white">Example : </span>
            <div id="schema-example">

            </div>
          </Row>
        </Col>
      </Row>
    )
  );
}

export default SchemaSettings;
