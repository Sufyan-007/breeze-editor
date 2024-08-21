import React from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import Delete from "../../../assets/icons/delete.svg";
// import "../../../css/NewBody.css";
// import "../../../css/NewParam.css";
import '../api_client.css';
function Param({ onChange, parameterData }) {
  const handleDelete = (index) => {
    const updatedParameters = parameterData.filter((_, i) => i !== index);
    onChange("parameters", updatedParameters);
  };
  const handleAddParam = () => {
    const newParam = {
      name: "",
      type: "",
      required: false,
      param_in: "query",
      description: "",
    };
    onChange("parameters", [...parameterData, newParam]);
  };
  const handleCheckboxChange = (index) => {
    const updatedParameters = parameterData.map((param, i) =>
      i === index ? { ...param, required: !param.required } : param
    );
    onChange("parameters", updatedParameters);
  };
  const handleChange = (field, index, value) => {
    const updatedParameters = parameterData.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    onChange("parameters", updatedParameters);
  };
  return (
    <div>
      <Row>
        <Col sm={11}>
          <h6 className="api-client-color-white">Query Parameters</h6>
        </Col>
        <Col sm={1}>
          <img
            className="mx-4 mb-2"
            width="24"
            height="24"
            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
            alt="add--v1"
            style={{ cursor: "pointer" }}
            onClick={handleAddParam}
          />
        </Col>
      </Row>
      <Table bordered hover variant="dark">
        <tbody>
          {parameterData &&
            parameterData.map((param, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    className="api-client-body-form-control api-client-h-10"
                    type="text"
                    placeholder="Name"
                    value={param.name ? param.name : ""}
                    onChange={(e) =>
                      handleChange("name", index, e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    className="api-client-body-form-control api-client-h-10"
                    type="text"
                    placeholder="Type"
                    value={param.type ? param.type : ""}
                    onChange={(e) =>
                      handleChange("type", index, e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={param.required}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td>
                  <img
                    className="mx-2 api-client-img"
                    src={Delete}
                    alt="Delete"
                    onClick={() => handleDelete(index)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Param;
