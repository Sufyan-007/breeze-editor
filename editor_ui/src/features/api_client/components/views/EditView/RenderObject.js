import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import edit from "../../../../../assets/icons/edit-icon.svg";
import Delete from "../../../../../assets/icons/delete-trash.svg";
function RenderObject({
  propertyName,
  value,
  updateParent,
  depth = 0,
  schemaList,
}) {
  const [val, setVal] = useState(value);
  const [name, setName] = useState(propertyName);
  const marginLeft = `${depth * 20}px`;
  const cardStyles = [
    { backgroundColor: "#343a40", borderColor: "rgba(128, 128, 128, 0.5)" }, // Depth 0
    { backgroundColor: "#495057", borderColor: "rgba(128, 128, 128, 0.5)" }, // Depth 1
    { backgroundColor: "#6c757d", borderColor: "rgba(128, 128, 128, 0.5)" }, // Depth 2
    // Add more styles as needed for deeper nesting levels
  ];
  const handleChanges = (prop, value) => {
    console.log(prop, value);
    if (prop === "name") {
      setName(() => {
        updateParent(val, value);
        return value;
      });
    } else {
      setVal((val) => {
        val[prop] = value;
        updateParent(val);
        return { ...val };
      });
    }
  };

  const addProperty = () => {
    const properties = val.properties || {};
    const newPropertyKey = `property${Object.keys(properties).length + 1}`;
    console.log("ADded property");
    const newProperty = {
      type: "",
      required: false,
      example: "",
      objectType: "",
    };
    setVal((prevState) => {
      properties[newPropertyKey] = newProperty;
      const updatedVal = {
        ...prevState,
        properties: properties,
      };
      updateParent(updatedVal);
      return updatedVal;
    });
  };

  const editChild = (key, value, newKey = null) => {
    if (value) {
      if (newKey) {
        setVal((val) => {
          delete val.properties[key];
          val.properties[newKey] = value;
          updateParent(val);
          return { ...val };
        });
      } else {
        setVal((val) => {
          val.properties[key] = value;
          updateParent(val);
          return { ...val };
        });
      }
    } else {
      setVal((val) => {
        delete val.properties[key];
        updateParent(val);
        return { ...val };
      });
    }
  };

  const deleteProperty = () => {
    updateParent(null, null);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyle = {
    backgroundColor: cardStyles[depth % cardStyles.length].backgroundColor,
    border: `1px solid ${cardStyles[depth % cardStyles.length].borderColor}`,
    marginLeft: marginLeft,
  };
  return (
    <>
      <Card
        key={name}
        text="white"
        className="rounded-0 mt-1"
        style={cardStyle}>
        <Card.Body className="d-flex justify-content-between text-white">
          {isExpanded ? (
            <>
              <div style={{ width: "30%" }}>
                {/* <Form.Label>Name:</Form.Label> */}
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Name"
                  defaultValue={name}
                  onBlur={(e) => handleChanges("name", e.target.value)}
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                />
              </div>
              <div style={{ width: "30%" }}>
                {/* <Form.Label>Type:</Form.Label> */}
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={val.type}
                  onChange={(e) => handleChanges("type", e.target.value)}>
                  <option value="">Select</option>
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="array">Array</option>
                  <option value="any">Any</option>
                  {schemaList && schemaList.map((name, index) => (
                      <option key={index} value={name.name}>
                        {name.name}
                      </option>
                    ))}
                </Form.Control>
              </div>
              {val.type === "string" || val.type === "integer" ? (
                <div style={{ width: "30%" }}>
                  {/* <Form.Label>Example:</Form.Label> */}
                  <Form.Control
                    className="text-white"
                    size="sm"
                    type="text"
                    placeholder="Value"
                    value={val.example}
                    onChange={(e) => handleChanges("example", e.target.value)}
                    style={{
                      backgroundColor: "#212529",
                      border: "1px solid rgba(128, 128, 128, 0.5)",
                    }}
                  />
                </div>
              ) :
              //  (
              //   <div style={{ width: "30%" }}>
              //     {/* <Form.Label>Object Type:</Form.Label> */}
              //     <Form.Control
              //       as="select"
              //       className="text-white"
              //       size="sm"
              //       style={{
              //         backgroundColor: "#212529",
              //         border: "1px solid rgba(128, 128, 128, 0.5)",
              //       }}
              //       value={val.objectType}
              //       onChange={(e) =>
              //         handleChanges("objectType", e.target.value)
              //       }>
              //       <option value="">Select</option>
              //       <option value="any">Any</option>
              //       <option value="custom">Custom</option>
              //       {schemaList && schemaList.map((name, index) => (
              //         <option key={index} value={name.name}>
              //           {name.name}
              //         </option>
              //       ))}
              //     </Form.Control>
              //   </div>
              // )
              null
              }
            </>
          ) : (
            <span>{name}</span>
          )}

          <div>
            <img
              alt="edit"
              className="mx-1"
              height={25}
              width={25}
              src={edit}
              onClick={() => setIsExpanded((state) => !state)}
              style={{ cursor: "pointer" }}
            />
            <img
              alt="delete"
              className="mx-1"
              height={25}
              width={25}
              src={Delete}
              style={{ cursor: "pointer" }}
              onClick={() => deleteProperty()}
            />
          </div>
        </Card.Body>

        {isExpanded && (
          <>
            {val.type === "object" && val.objectType === "custom" && (
              // <Card.Body>
                <div className="text-white p-1 my-1" >
                  <div className="d-flex">
                    <span className="text-white mx-3">Sub Properties</span>
                    <img
                      className=" mb-1"
                      width="25"
                      height="25"
                      src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                      alt="add--v1"
                      onClick={addProperty}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  {val.properties &&
                    Object.entries(val.properties).map(([key, value]) => {
                      return (
                        <RenderObject
                          key={key}
                          propertyName={key}
                          value={value}
                          updateParent={(value, newKey = null) =>
                            editChild(key, value, newKey)
                          }
                          depth={depth + 1}
                          schemaList={schemaList}
                        />
                      );
                    })}
                </div>
              // </Card.Body>
            )}
          </>
        )}
      </Card>
    </>
  );
}

export default RenderObject;
