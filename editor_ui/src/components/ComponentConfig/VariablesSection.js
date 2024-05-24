import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Table,
  ButtonGroup,
  Alert,
} from "react-bootstrap";
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/delete-trash.svg";
import { useParams } from "react-router";

const API_URL = "http://localhost:8000/editor/variables/";
const dataTypes = ["string", "number", "boolean", "date", "array", "object"];

export default function VariablesSection({ config }) {
  const offcanvasRef = useRef(null);
  const { projectName, componentName } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    datatype: "",
    defaultValue: "",
    description: "",
  });

  const [variables, setVariables] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // To track the id of the variable being edited

  useEffect(() => {
    fetchVariables();
  }, []);

  const fetchVariables = async () => {
    try {
      const response = await fetch(
        `${API_URL}?project_id=${projectName}&comp_name=${componentName}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVariables(data);
    } catch (error) {
      setError(error.message || "Failed to fetch variables.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editId ? "PUT" : "POST";
    const payload = {
      project_id: projectName,
      component: componentName,
      variable_config: {
        name: formData?.name,
        type: formData?.type,
        datatype: formData?.datatype,
        defaultValue: formData?.defaultValue,
        description: formData?.description,
        ...(method === "PUT" && { $id: editId }),
      },
    };

    console.log("payload::>>", payload);

    try {
      const response = await fetch(API_URL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        if (editId) {
          const updatedData = variables.map((item) =>
            item.$id === editId ? result : item
          );
          setVariables(updatedData);
        } else {
          setVariables([...variables, result]);
        }
        handleCloseOffcanvas();
      } else {
        setError(result.message || "Failed to save variable.");
      }
    } catch (error) {
      setError(error.message || "Failed to save variable.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const variable = variables.find((item) => item.$id === id);
    setFormData(variable);
    setEditId(id);
    openOffcanvas();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}?project_id=${projectName}&comp_name=${componentName}&variable_id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedData = variables.filter((item) => item.$id !== id);
        setVariables(updatedData);
      } else {
        const result = await response.json();
        setError(result.message || "Failed to delete variable.");
      }
    } catch (error) {
      setError(error.message || "Failed to delete variable.");
    }
  };

  const openOffcanvas = () => {
    offcanvasRef.current.classList.add("show");
  };

  const handleCloseOffcanvas = () => {
    offcanvasRef.current.classList.remove("show");
    setFormData({
      name: "",
      type: "",
      datatype: "",
      defaultValue: "",
      description: "",
    });
    setEditId(null);
    setError(null);
  };

  function getDefaultAsString(value) {
    if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return value.toString();
    }
  }

  return (
    <>
      <div
        className="row flex-grow-1 h-100 p-2 text-white"
        style={{ backgroundColor: "#303033" }}
      >
        <Container>
          <div className="d-flex align-items-center justify-content-between my-2 mx-3">
            <div className="text-left mt-2">
              <h4>Variables</h4>
            </div>
            <div>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={openOffcanvas}
              >
                Add Variable
              </button>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            style={{ width: "400px" }}
            ref={offcanvasRef}
            data-bs-theme="dark"
          >
            <div className="offcanvas-header pb-0">
              <h5>{editId ? "Edit Variable" : "Add Variable"}</h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={handleCloseOffcanvas}
              ></button>
            </div>
            <div className="offcanvas-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formVariableName">
                  <Form.Label>Variable Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    placeholder="var"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formVariableType">
                  <Form.Label>Variable Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={formData?.type}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="stateVars">State</option>
                    <option value="propsVars">Prop</option>
                    <option value="otherVars">Other</option>
                    <option value="refVars">Ref</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDataType">
                  <Form.Label>Data Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="datatype"
                    value={formData.datatype}
                    onChange={handleChange}
                  >
                    <option value="">Select a data type</option>
                    {dataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDefaultValue">
                  <Form.Label>Default Value</Form.Label>
                  <Form.Control
                    type="text"
                    name="defaultValue"
                    value={getDefaultAsString(formData.defaultValue)}
                    onChange={handleChange}
                    placeholder="value"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  />
                </Form.Group>
                <div className="d-flex">
                  <Button
                    variant="secondary"
                    className="me-3"
                    type="submit"
                    disabled={loading}
                  >
                    {editId ? "Update" : "Submit"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>

          <Table striped bordered hover variant="dark" className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Variable Name</th>
                <th>Variable Type</th>
                <th>Data Type</th>
                <th>Default Value</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td><span class="badge badge-light" style={{backgroundColor: '#6d00cc'}}>{item.datatype}</span></td>
                  <td>{getDefaultAsString(item.defaultValue)}</td>
                  <td>{item.description}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="transparent"
                        onClick={() => handleEdit(item.$id)}
                        title="Edit"
                      >
                        <img
                          src={EditIcon}
                          alt="Edit"
                          height={24}
                          className="mx-2"
                        />
                      </Button>
                      <Button
                        variant="transparent"
                        onClick={() => handleDelete(item.$id)}
                        title="Delete"
                      >
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          height={24}
                          className="mx-2"
                        />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
}
