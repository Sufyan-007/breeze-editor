import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
// import RenderObject from "./RenderObject";
import { getApiSchemaDetails } from "../../../services/ApiService";
import { useParams } from "react-router";
function BodySettings({ bodyData, onChange }) {
  const [body, setBody] = useState(bodyData);
  const [schemaList, setSchemaList] = useState([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  const { projectName } = useParams();

  const fetchSchemasList = useCallback(
    async (schemaName) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaName);
        if (schemaName) {
          return result;
        } else {
          // needs to be changed later 
          const combinedSchemaList = result.flatMap(module => module.schemas);
          setSchemaList(combinedSchemaList);
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
    console.log(key, newKey, newValue, "valuessss");
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
        onChange("body", updatedBody);
      }
    } else {
      if (body.schema && body.schema.properties) {
        const updatedBody = { ...body };
        delete updatedBody.schema.properties[key];
        setBody(updatedBody);
        console.log(updatedBody, "updatedbody");
        onChange("body", updatedBody);
      }
    }
  };
  const handleSchemaChange = async (value) => {
    const updatedSchema = await fetchSchemasList(value);
    console.log(updatedSchema, "updatedSchema");
    setBody((state) => {
      state.schema = updatedSchema;
      state.schema_name = value;
      onChange("body", [state]);
      return { ...state };
    });
    // const updatedBody = { ...body };
    // updatedBody.schema = updatedSchema;
    // updatedBody.schema_name = value;
    // onChange("body", [updatedBody]); // needs to be changed when body will be of one type only
  };
  const handleChanges = (prop, value) => {
    console.log(prop, value);
    const newBody = { ...body };
    newBody[prop] = value;
    setBody(newBody);
    onChange("body", [newBody]);
  };
  useEffect(() => {
    setBody(bodyData);
  }, [bodyData]);
  return body ? (
    <>
      <div className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
        <div className="mx-3 mb-2" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Content Type:</Form.Label>
          <Form.Control
            as="select"
            className="text-white"
            size="sm"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={body.content_type}
            onChange={(e) => handleChanges("content_type", e.target.value)}>
            <option value="">Select</option>
            <option value="JSON">Json</option>
            <option value="TEXT">Text</option>
            <option value="HTML">Html</option>
          </Form.Control>
        </div>
        {body.content_type === "TEXT" ? (
          <>
            <div className="mx-1 mb-2" style={{ width: "60%" }}>
              <Form.Label className="text-white mb-1">Value:</Form.Label>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="Key"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={body.raw_content}
                onChange={(e) => handleChanges("raw_content", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mx-1 mb-2" style={{ width: "30%" }}>
              <Form.Label className="text-white mb-1">Mode:</Form.Label>
              <Form.Control
                as="select"
                className="text-white"
                size="sm"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={body.mode}
                onChange={(e) => handleChanges("mode", e.target.value)}>
                <option value="">Select</option>
                <option value="RAW">Raw</option>
                <option value="BINARY">Binary</option>
                <option value="URLENCODED">Urlencoded</option>
              </Form.Control>
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
                    <option key={index} value={name.id}>
                      {name.name}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </div>
          </>
        )}
      </div>
      {/* {body.content_type !== "text" &&
        body.schema.properties &&
        Object.entries(body.schema.properties).length > 0 && (
          <div
            className="p-2 m-2 d-flex flex-column"
            style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
            <div className="d-flex justify-content-between">
              <span>Schema Properties:</span>
              <div>
                <img
                  className="mx-2 mb-1"
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                  alt="add--v1"
                  onClick={addProperty}
                  style={{ cursor: "pointer" }}
                />
                <img
                  className="mx-1"
                  width="20"
                  height="20"
                  src="https://img.icons8.com/fluency-systems-filled/48/FFFFFF/expand-arrow.png"
                  alt="expand-arrow"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              </div>
            </div>
            {
              isExpanded &&
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
        )} */}
    </>
  ) : (
    <div className="text-white">-----No Body Present-----</div>
  );
}

export default BodySettings;
