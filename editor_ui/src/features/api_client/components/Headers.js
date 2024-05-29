import React from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import Delete from '../../../assets/icons/delete.svg'
// import "../../../css/NewBody.css"
import '../api_client.css';
function Headers({headerData, onChange}) {
    const handleDelete = (index) => {
        const updatedHeader = headerData.filter((_, i) => i !== index);
        onChange("headers", updatedHeader);
      };
      const handleAddHeader = () => {
        const newHeader = {
          key: "",
          value: "",
        };
        onChange("headers", [...headerData, newHeader]);
      };
      const handleChange = (field, index, value) => {
        const updatedHeader = headerData.map((param, i) =>
          i === index ? { ...param, [field]: value } : param
        );
        onChange("headers", updatedHeader);
      };
    return (
        <div>
          <Row>
            <Col
             sm={11}>
              <h6 style={{ color: "white" }}>Headers</h6>
            </Col>
            <Col sm={1}>
              <img
                className="mx-4 mb-2"
                width="24"
                height="24"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{cursor: "pointer"}}
                onClick={handleAddHeader}
              />
            </Col>
          </Row>
          <Table  bordered hover variant="dark">
            <tbody>
              {headerData && headerData.map((header, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      className="api-client-body-form-control"
                      type="text"
                      placeholder="Key"
                      value={header.key ? header.key : ""}
                      style={{ color: "black", height:"10%", border: "none", backgroundColor: "gray" }}
                      onChange={(e) => handleChange("key", index, e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                    className="api-client-body-form-control"
                      type="text"
                      placeholder="Value"
                      value={header.value ? header.value : ""}
                      style={{ color: "black", height:"10%", border:"none", backgroundColor: "gray" }}
                      onChange={(e) => handleChange("value", index, e.target.value)}
                    />
                  </td>
                  <td>
                    <img
                      className="mx-2"
                      src={Delete}
                      alt="Delete"
                      onClick={() => handleDelete(index)}
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
}

export default Headers
