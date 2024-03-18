import React, { useState, useRef } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
export default function Body() {
  const [body, setBody] = useState({
    mode: "raw",
    content_type: "application/json",
    required: false,
    schema_name: "",
    raw_content: "",
    file: "",
    formdata: [],
  });
  const fileInputRefBinary = useRef(null);
  const fileInputRefFormData = useRef(null);

  const handleBodyChange = (name, value) => {
    setBody({
      ...body,
      [name]: value,
    });
    //  onChange({ body: { ...body, [name]: value } });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file extension is not .bin
      if (!file.name.toLowerCase().endsWith(".bin")) {
        // Display an alert to the user
        alert("Wrong file selected. Please select a .bin file.");
        // Clear the file input field
        e.target.value = null;
        return;
      }
      setBody({
        ...body,
        file: file,
      });
      //    onChange({ file: file });
    }
  };

  const handleFormDataChange = (index, name, value) => {
    const updatedFormdata = [...body.formdata];
    updatedFormdata[index][name] = value;
    setBody({
      ...body,
      formdata: updatedFormdata,
    });
    console.log(name,value);
    // if (name === "type" && value === "upload_file") {
    //   // If "Upload File" is selected, trigger the file input click event
    //   fileInputRefBinary.current.click();
    // }
    //  onChange({ formData: updatedFormdata });
  };

  const removeFormData = (index) => {
    const updatedFormdata = [...body.formdata];
    updatedFormdata.splice(index, 1);
    setBody({
      ...body,
      formdata: updatedFormdata,
    });
    //  onChange({ formdata: updatedFormdata });
  };

  const addFormData = () => {
    setBody({
      ...body,
      formdata: [
        ...body.formdata,
        { key: "", value: "", description: "", type: "", src: "" },
      ],
    });
    //  onChange({
    //    body: {
    //      ...body,
    //      formdata: [
    //        ...body.formdata,
    //        { key: "", value: "", description: "", type: "", src: "" },
    //      ],
    //    },
    //  });
  };
  const openFileInputFormData = (index) => {
    fileInputRefFormData.current.click();
  };

  // Define a function to handle the file selection in the form data
  const handleFormDataFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Set the selected file to the corresponding formdata's value
      const updatedFormdata = [...body.formdata];
      updatedFormdata[index].value = file;
      setBody({
        ...body,
        formdata: updatedFormdata,
      });
    }
  };
  return (
    <div>
      <Form.Group controlId="formBody">
        <Form.Label className="mt-3" style={{ fontWeight: "bold" }}>
          Body:
        </Form.Label>

        {/* Radio buttons for ModeEnum */}
        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Mode:
          </Form.Label>
          <Form.Check
            type="radio"
            label="Raw"
            name="mode"
            value="raw"
            checked={body.mode === "raw"}
            onChange={(e) => handleBodyChange("mode", e.target.value)}
            inline
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="None"
            name="mode"
            value="none"
            checked={body.mode === "none"}
            onChange={(e) => handleBodyChange("mode", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="Form Data"
            name="mode"
            value="form-data"
            checked={body.mode === "form-data"}
            onChange={(e) => handleBodyChange("mode", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="Binary"
            name="mode"
            value="binary"
            checked={body.mode === "binary"}
            onChange={(e) => handleBodyChange("mode", e.target.value)}
          />
        </div>
        {/* Conditional rendering of file input field */}
        {body.mode === "binary" && (
          <div>
            <Form.Label style={{ fontWeight: "bold" }} className="m-3">
              Upload Binary File (.bin):
            </Form.Label>
            <Form.Control
              type="file"
              accept=".bin"
              ref={fileInputRefBinary}
              onChange={handleFileInputChange}
            />
          </div>
        )}
        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Content Type:
          </Form.Label>

          <Form.Check
            inline
            type="radio"
            label="JSON"
            name="content_type"
            value="application/json"
            checked={body.content_type === "application/json"}
            onChange={(e) => handleBodyChange("content_type", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="TEXT"
            name="content_type"
            value="text/plain"
            checked={body.content_type === "text/plain"}
            onChange={(e) => handleBodyChange("content_type", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="HTML"
            name="content_type"
            value="text/plain"
            checked={body.content_type === "text/plain"}
            onChange={(e) => handleBodyChange("content_type", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="XML"
            name="content_type"
            value="text/plain"
            checked={body.content_type === "text/plain"}
            onChange={(e) => handleBodyChange("content_type", e.target.value)}
            disabled={body.mode === "binary"}
          />
          <Form.Check
            inline
            type="radio"
            label="Javascript"
            name="content_type"
            value="text/plain"
            checked={body.content_type === "text/plain"}
            onChange={(e) => handleBodyChange("content_type", e.target.value)}
            disabled={body.mode === "binary"}
          />
        </div>
        <div>
          <Form.Check
            style={{ fontWeight: "bold" }}
            className="m-3"
            type="checkbox"
            label="Required"
            id="body-required"
            checked={body.required}
            onChange={(e) => handleBodyChange("required", e.target.checked)}
            disabled={body.mode === "binary"}
          />
        </div>

        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Schema Name:
          </Form.Label>
          <Form.Control
            type="text"
            value={body.schema_name}
            onChange={(e) => handleBodyChange("schema_name", e.target.value)}
            disabled={body.mode === "binary"}
          />
        </div>
        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Raw Content:
          </Form.Label>
          <Form.Control
            type="text"
            value={body.raw_content}
            onChange={(e) => handleBodyChange("raw_content", e.target.value)}
            disabled={body.mode === "binary"}
          />
        </div>
        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            FormData:
          </Form.Label>
          {body.formdata.map((formData, index) => (
            <div key={index} className="mb-2">
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Key"
                    value={formData.key}
                    onChange={(e) =>
                      handleFormDataChange(index, "key", e.target.value)
                    }
                  />
                </Col>
                {/* <Col>
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    value={formData.value}
                    onChange={(e) =>
                      handleFormDataChange(index, "value", e.target.value)
                    }

                  />
                </Col> */}
                <Col>
                  {formData.type === "upload_file" ? (
                    // If type is "upload_file", render file input
                    <div>
                      <Form.Control
                        type="file"
                        style={{ display: "none" }} // Hide the file input
                        ref={fileInputRefFormData}
                        onChange={(e) => handleFormDataFileChange(e, index)}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Select File"
                        value={formData.value ? formData.value.name : ""}
                        onClick={() => openFileInputFormData(index)}
                        style={{
                          cursor: "pointer",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  ) : (
                    // If type is not "upload_file", render regular text input
                    <Form.Control
                      type="text"
                      placeholder="Value"
                      value={formData.value}
                      onChange={(e) =>
                        handleFormDataChange(index, "value", e.target.value)
                      }
                    />
                  )}
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleFormDataChange(index, "description", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) =>
                      handleFormDataChange(index, "type", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="text">Text</option>
                    <option value="upload_file">File</option>
                  </Form.Select>
                </Col>
                {/* {formData.type === "upload_file" && (
                  <div>
                    <Form.Control
                      type="text"
                      placeholder="Select File"
                      value={formData.value ? formData.value.name : ""} // Display selected file name if available
                      onClick={() => openFileInputFormData(index)} // Trigger file input click event
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRefFormData}
                      style={{ display: "none" }} // Hide the file input
                      onChange={(e) => handleFormDataFileChange(e, index)} // Handle file change
                    />
                  </div> */}
                {/* )} */}
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Source"
                    value={formData.src}
                    onChange={(e) =>
                      handleFormDataChange(index, "src", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => removeFormData(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}

          {/* Button to add more Formdata */}
          <div className="m-3">
            <Button
              variant="secondary"
              onClick={addFormData}
              disabled={body.mode === "binary"}
            >
              Add Formdata
            </Button>
          </div>
        </div>
      </Form.Group>
    </div>
  );
}
