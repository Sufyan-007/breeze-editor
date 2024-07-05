import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import RenderObject from "./RenderObject";
import { getApiSchemaDetails } from "../services/ApiService";
import { useParams } from "react-router";
function BodySettings({ bodyData }) {
  const [body, setBody] = useState(bodyData[0]);
  const [schemaList, setSchemaList] = useState([]);
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
      Object.keys(body.schema.properties).length + 1
    }`;
    const newProperty = {
      type: "",
      required: false,
      example: "",
      objectType: "",
    };
    setBody((state) => {
      state.schema.properties[newPropertyKey] = newProperty;
      return { ...state };
    });
  };
  const editProperty = (key, newValue, newKey) => {
    if (newValue) {
      const updatedBody = { ...body };
      if (updatedBody.schema && updatedBody.schema.properties) {
        if (newKey) {
          delete updatedBody.schema.properties[key];
          updatedBody.schema.properties[newKey] = newValue;
        } else {
          updatedBody.schema.properties[key] = newValue;
        }
        setBody(updatedBody);
      }
    } else {
      if (body.schema && body.schema.properties) {
        const updatedBody = { ...body };
        delete updatedBody.schema.properties[key];
        setBody(updatedBody);
      }
    }
  };
  const handleSchemaChange = async(value)=>{
    const updatedSchema = await fetchSchemasList(value);
    setBody((state)=>{
      state.schema = updatedSchema
      state.schema_name = value
      return {...state}
    })
  }
  useEffect(() => {
    setBody(bodyData[0]);
  }, [bodyData]);
  return body ? (
    <>
      <div className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
        <div className="mx-3" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Content Type:</Form.Label>
          <Form.Control
            className="text-white"
            size="sm"
            type="text"
            placeholder="Base URL"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={body.content_type || ""}
          />
        </div>
        <div className="mx-1" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Mode:</Form.Label>
          <Form.Control
            className="text-white"
            size="sm"
            type="text"
            placeholder="Path"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={body.mode || ""}
          />
        </div>
        <div className="mx-1 mb-2" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Schema name:</Form.Label>
          <div className="d-flex">
            <Form.Control
              as="select"
              className="text-white"
              size="sm"
              style={{
                backgroundColor: "#212529",
                border: "1px solid rgba(128, 128, 128, 0.5)",
              }}
              value={body.schema_name}
              onChange={(e) => handleSchemaChange(e.target.value)}>
              <option value="">Select</option>
              {schemaList.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
      </div>
      <div className="p-2 m-2" style={{ border: "1px solid gray" }}>
        <span>Schema Properties:</span>
        <img
          className="mx-2 mb-1"
          width="25"
          height="25"
          src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
          alt="add--v1"
          onClick={addProperty}
          style={{ cursor: "pointer" }}
        />
        {body.schema &&
          Object.entries(body.schema.properties).map(([key, value]) => (
            <RenderObject
              propertyName={key}
              value={value}
              updateParent={(value, newKey = null) =>
                editProperty(key, value, newKey)
              }
            />
          ))}
      </div>
    </>
  ) : (
    <div className="text-white">-----No Body Present-----</div>
  );
}

export default BodySettings;
