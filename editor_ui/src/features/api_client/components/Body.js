import React, { useState, useEffect, useRef } from "react";
import { Form, Nav, Navbar, Table } from "react-bootstrap";
import Delete from "../../../assets/icons/delete.svg";
import Remove from "../../../assets/icons/remove.svg";
// import "../../../css/NewBody.css";
import '../api_client.css';
import * as monaco from "monaco-editor";

function Body({ bodyData, onChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [body, setBody] = useState([]);
  const [hasBody, setHasBody] = useState(bodyData.length > 0 ? true : false);
  const [formData, setFormData] = useState({});
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("");
  const [availableProperties, setAvailableProperties] = useState([
    "id",
    "name",
    "Category",
    "photoUrls",
    "tags",
    "status",
  ]);
  const [newProperty, setNewProperty] = useState({
    type: "integer",
    example: 10,
  });
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  const handleDelete = (key) => {
    const updatedBodyData = [...bodyData];
    const keyParts = key.split(".");

    let nestedObj = updatedBodyData[activeTab].schema.properties;
    let parentObj = null;
    for (let i = 0; i < keyParts.length - 1; i++) {
      parentObj = nestedObj;
      nestedObj = nestedObj[keyParts[i]].properties;
    }

    delete nestedObj[keyParts[keyParts.length - 1]];

    // Check and remove empty parent objects
    for (let i = keyParts.length - 2; i >= 0; i--) {
      const currentKey = keyParts[i];
      // const parentKey = keyParts[i - 1];
      if (Object.keys(nestedObj).length === 0) {
        delete parentObj[currentKey];
        nestedObj = parentObj;
        if (i > 0) {
          parentObj = updatedBodyData[activeTab].schema.properties;
          for (let j = 0; j < i - 1; j++) {
            parentObj = parentObj[keyParts[j]].properties;
          }
        }
      }
    }
    onChange("body", updatedBodyData);
    setFormData(updatedBodyData[activeTab].schema.properties);
  };

  const handleSelect = (selectedIndex) => {
    setActiveTab(selectedIndex);
    console.log(bodyData[selectedIndex], "selected");
    if (body.length > 0) onChange("body", body);
  };
  const handleChange = (key, prop, value) => {
    const newVal = [...bodyData];
    const keyParts = prop.split("."); // Split the key by '.' to access nested properties
    let nestedObj = newVal[activeTab].schema.properties;
    let deepNestedobj = null;
    for (let i = 0; i < keyParts.length - 1; i++) {
      if (nestedObj[keyParts[i]].properties) {
        deepNestedobj = nestedObj[keyParts[i]];
        nestedObj = nestedObj[keyParts[i]].properties;
      }
    }
    if (deepNestedobj) {
      const updatedProperty = {
        ...deepNestedobj["properties"][keyParts[keyParts.length - 2]],
        [keyParts[keyParts.length - 1]]: value,
      };
      deepNestedobj["properties"][keyParts[keyParts.length - 2]] = {
        ...deepNestedobj["properties"][keyParts[keyParts.length - 2]],
        ...updatedProperty,
      };
      console.log(deepNestedobj, "updated nestedfobj");
      const updatedSchema = {
        ...newVal[activeTab].schema.properties,
        [keyParts[0]]: deepNestedobj,
      };
      console.log(updatedSchema, "neww");
      const updatedBodyData = [...newVal];
      updatedBodyData[activeTab].schema.properties = updatedSchema;
      // Update data structure with updatedBodyData
      onChange("body", updatedBodyData);
    } else {
      newVal[activeTab].schema.properties[key] = {
        ...newVal[activeTab].schema.properties[key],
        [keyParts[keyParts.length - 1]]: value,
      };
      onChange("body", newVal);
    }
  };

  const handleRemoveBody = (index) => {
    const updatedBodyData = [...bodyData];
    updatedBodyData.splice(index, 1);
    setBody(updatedBodyData);
    onChange("body", updatedBodyData);
  };
  useEffect(() => {
    if (bodyData.length > 0) {
      setFormData(
        bodyData[activeTab] &&
          bodyData[activeTab].schema &&
          bodyData[activeTab].schema.properties
      );
    }
    if (bodyData.length > 0 && editorContainerRef.current) {
      const editor = monaco.editor.create(editorContainerRef.current, {
        value: JSON.stringify(bodyData[activeTab].raw_content, null, 2),
        language: "text",
        theme: "vs-dark",
      });
      editorRef.current = editor;

      // Event listener for content changes
      const disposable = editor.onDidChangeModelContent(() => {
        const updatedContent = editor.getValue();
        try {
          const parsedContent = JSON.parse(updatedContent);
          const updatedBodyData = [...bodyData];
          updatedBodyData[activeTab].raw_content = parsedContent;
          setBody(updatedBodyData);
        } catch (error) {
          console.error("Invalid text:", error);
        }
      });

      return () => {
        disposable.dispose();
        editor.dispose();
      };
    }
  }, [bodyData, activeTab, onChange]);

  const handleFormChange = (value) => {
    const newBody = {
      content_type: value,
      raw_content: "",
      formdata: [],
      mode: "NONE",
    };
    const updatedBody = [...bodyData, newBody];
    setBody(updatedBody);
    onChange("body", updatedBody);
    setActiveTab(updatedBody.length - 1);
    setHasBody(true);
  };

  const renderNestedFields = (properties, depth = 0, prefix = "") => {
    return (
      properties &&
      Object.entries(properties).map(([key, value], index) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        return (
          <React.Fragment key={index}>
            <tr>
              <td style={{ paddingLeft: depth * 15 }}>{key}</td>
              {value.type === "object" ? (
                <td colSpan="3">
                  <Table bordered variant="dark">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Example</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderNestedFields(value.properties, depth + 1, fullKey)}
                    </tbody>
                  </Table>
                </td>
              ) : (
                <>
                  <td>
                    <Form.Control
                      className="api-client-body-form-control"
                      as="select"
                      value={value.type}
                      onChange={(e) =>
                        handleChange(key, `${fullKey}.type`, e.target.value)
                      }>
                      <option value="">Select Type</option>
                      <option value="string">String</option>
                      <option value="integer">Integer</option>
                      <option value="array">Array</option>
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      className="api-client-body-form-control"
                      type="text"
                      value={value.example}
                      onChange={(e) =>
                        handleChange(key, `${fullKey}.example`, e.target.value)
                      }></Form.Control>
                  </td>
                  <td>
                    <img
                      className="mx-2"
                      src={Delete}
                      alt="Delete"
                      onClick={() => handleDelete(fullKey)}
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </td>
                </>
              )}
            </tr>
          </React.Fragment>
        );
      })
    );
  };

  const addSchema = () => {
    if (!selectedProperty) {
      console.error("No property selected");
      return;
    }
    const updatedBodyData = [...bodyData];
    if (!updatedBodyData[activeTab].schema) {
      updatedBodyData[activeTab].schema = {
        type: "object",
        properties: {},
      };
    }
    let newProp;
    if (selectedProperty === "Category") {
      newProp = {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Dogs" },
        },
      };
    } else {
      newProp = newProperty;
    }

    updatedBodyData[activeTab].schema.properties[selectedProperty] = newProp;

    setNewProperty({ type: "string", example: "" });
    setSelectedProperty(""); // Reset selected property
    setFormData(updatedBodyData[activeTab].schema.properties);
    onChange("body", updatedBodyData);
  };

  return (
    <div className="api-client-w-full api-client-h-full">
      <div className="api-client-h-15">
        {hasBody ? (
          <>
            <Navbar bg="dark" variant="dark" className="api-client-h-70">
              <Nav activeKey={activeTab} onSelect={handleSelect}>
                {bodyData.map((body, index) => (
                  <Nav.Link key={index} eventKey={index}>
                    {body.content_type ? body.content_type : null}
                    <img
                      className="mx-2 mb-1"
                      width="20"
                      height="20"
                      src={Remove}
                      alt="remove"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveBody(index)}
                    />
                  </Nav.Link>
                ))}
                <img
                  className="mt-2"
                  width="24"
                  height="24"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                  alt="add--v1"
                  style={{ cursor: "pointer" }}
                  onClick={() => setHasBody(false)}
                />
              </Nav>
            </Navbar>
            <div
              className="mt-1 api-client-d-flex api-client-border-white api-client-w-full"
              id="select-content-type">
              <Form.Select
                className="api-client-w-10 api-client-body-select"
                value={selectedProperty ? selectedProperty : "Schema Name"}
                onChange={(e) => setSelectedProperty(e.target.value)}>
                <option value="" disabled>
                  {bodyData[activeTab]
                    ? bodyData[activeTab].schema_name
                    : "Schema Name"}
                </option>

                {availableProperties.map((prop) => (
                  <option key={prop} value={prop}>
                    {prop}
                  </option>
                ))}
              </Form.Select>
              <img
                className="mx-3 mt-1"
                width="24"
                height="24"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{ cursor: "pointer" }}
                onClick={addSchema}
              />
            </div>
          </>
        ) : (
          <>
            <div className="api-client-d-flex">
              <h6
                className="mt-2 mx-2 api-client-color-white"
               >
                Content-Type
              </h6>
              <Form.Select
              className="api-client-w-15 api-client-h-full api-client-body-select"
                value={selectedContentType}
                onChange={(e) => handleFormChange(e.target.value)}>
                <option value="" disabled>
                  Please Select
                </option>
                <option value="FORMDATA">FORMDATA</option>
                <option value="JSON">JSON</option>
                <option value="URLENCODED">URLENCODED</option>
                <option value="TEXT">TEXT</option>
              </Form.Select>
            </div>
          </>
        )}
      </div>
      {bodyData.length > 0 && (
        <>
          <div id="body-content"
            className="mt-5 api-client-color-white api-client-w-full api-client-h-full api-client-overflow">
            {bodyData[activeTab] &&
              (bodyData[activeTab].content_type === "JSON" ||
                bodyData[activeTab].content_type === "FORMDATA" ||
                bodyData[activeTab].content_type === "URLENCODED") && (
                <Table
                  striped
                  bordered
                  hover
                  variant="dark"
                  >
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Example</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderNestedFields(formData)}</tbody>
                </Table>
              )}
            {bodyData[activeTab] &&
              bodyData[activeTab].content_type === "TEXT" && (
                <div
                  className="api-client-monaco-div"
                  id="text-editor"
                  ref={editorContainerRef}
                  ></div>
              )}
            {bodyData[activeTab] &&
              bodyData[activeTab].content_type === "XML" && (
                <div>
                  <h6>
                    {bodyData[activeTab] && bodyData[activeTab].schema_name}
                  </h6>
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default Body;
