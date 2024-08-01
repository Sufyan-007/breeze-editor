import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import RenderObject from "../EditView/RenderObject";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import edit from "../../../../../assets/icons/edit-icon.svg";
import { getApiSchemaDetails } from "../../../services/ApiService";
import { useParams } from "react-router";
// import MonacoEditor from '../../../components/common/MonacoEditor'
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
  const [schemaList, setSchemaList] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const { projectName } = useParams();

  const fetchSchemasList = useCallback(
    async (schemaName) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaName);
        if (schemaName) {
          return result;
        } else {
          setSchemaList(result);
        }
        // console.log(result, "result");
      } catch (e) {
        console.error(e);
      }
    },
    [projectName]
  );
  useEffect(() => {
    fetchSchemasList(null);
  }, [fetchSchemasList]);

  const addProperty = () => {
    const newPropertyKey = `property${
      Object.keys(defaultSchemaObj.properties).length + 1
    }`;
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
    e.preventDefault();
    // console.log(id, "iddddd");
    const finalSchema = { id, details: defaultSchemaObj };
    const operation = id ? "edit" : "add";
    console.log(operation, "operation");
    if (operation === "add") {
      const result = await addSchema(projectName, finalSchema);
      if (result.message) {
        fetchSchemasList(null);
      }
    } else {
      const result = await editSchema(projectName, finalSchema, id);
      if (result.message) {
        fetchSchemasList(null);
      }
    }
  };
  const handleSchemaOperations = async (operation, schema, index) => {
    console.log(operation, schema, "operation");
    if (operation === "edit") {
      setSelectedSchema(schema.name);
      setId(schema.id);
      const details = await fetchSchemasList(schema.id);
      // console.log(details, "details");
     setDefaultSchemaObj(details)
    } else if (operation === "delete") {
      console.log(schema, index, "schema and index");
      const result = await deleteSchema(projectName, schema.id);
      if (result.message) {
        fetchSchemasList(null);
      }
    }
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
            <img
              width="25"
              height="25"
              className="mx-1"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
              alt="add--v1"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDefaultSchemaObj({
                  type: "object",
                  properties: {},
                  required: [],
                  name: "",
                });
              }}
            />
          </div>
          {schemaList.length > 0 ? (
            <div>
              {schemaList.map((schema, index) => (
                <div
                  key={index}
                  className="text-white mt-2 d-flex justify-content-between">
                  <span className="overflow-auto">{schema.name}</span>
                  <div className="d-flex">
                    <img
                      src={edit}
                      alt="edit"
                      height={20}
                      width={20}
                      style={{ cursor: "pointer" }}
                      className="mx-1"
                      onClick={() =>
                        handleSchemaOperations("edit", schema, null)
                      }
                    />
                    <img
                      src={Delete}
                      alt="delete"
                      height={20}
                      width={20}
                      style={{ cursor: "pointer" }}
                      className="mx-1"
                      onClick={() =>
                        handleSchemaOperations("delete", schema, index)
                      }
                    />
                  </div>
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
            <div>
              <Button
                variant="secondary"
                className="rounded-0 mt-4"
                onClick={(e) => onSubmit(e)}>
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
            Object.entries(defaultSchemaObj.properties).map(([key, value]) => {
              return (
                <RenderObject
                  key={key}
                  propertyName={key}
                  value={value}
                  updateParent={(value, newKey = null) =>
                    editProperty(key, value, newKey)
                  }
                  schemaList={schemaList}
                />
              );
            })}

            <Row className="mb-2 mt-4 mx-2 h-50 " style={{border:"1px solid white"}}>
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
