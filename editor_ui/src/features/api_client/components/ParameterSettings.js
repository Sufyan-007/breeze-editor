import React from "react";
import { Button, Form } from "react-bootstrap";
// import edit from "../../../assets/icons/edit-icon.svg";
import Delete from "../../../assets/icons/delete-trash.svg";

function ParameterSettings({ paramData }) {
  return (
    <>
      {paramData.length > 0 ? (
        paramData.map((param, index) => (
          <div key={index} className="mt-2 rounded-0 text-white" bg="dark">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between" style={{width:"90%"}}>
                <Form.Control
                  className="text-white mb-2 mx-1"
                  size="sm"
                  type="text"
                  placeholder="Parameter Name"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                    display: "inline-block",
                  }}
                  value={param.name}
               
                />
                <Form.Control
                  className="text-white mb-2 mx-1"
                  size="sm"
                  type="text"
                  placeholder="Parameter In"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                    display: "inline-block",
                  }}
                  value={param.param_in}
                 
                />
                <Form.Control
                  className="text-white mb-2 mx-1"
                  size="sm"
                  type="text"
                  placeholder="Type"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                    display: "inline-block",
                  }}
                  value={param.type}
                  
                />
                <Form.Control
                  className="text-white mb-2 mx-1"
                  size="sm"
                  type="text"
                  placeholder="Required"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                    display: "inline-block",
                  }}
                  value={param.required ? "Required" : "Optional"}
                />
              </div>
              <div className="d-flex">
                <img
                  alt="delete"
                  className="mb-2"
                  height={25}
                  width={25}
                  src={Delete}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Button>Add Param</Button>
      )}
    </>
  );
}

export default ParameterSettings;
