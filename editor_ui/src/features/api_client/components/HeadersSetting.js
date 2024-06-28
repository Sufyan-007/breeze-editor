import React from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../assets/icons/delete-trash.svg";
function HeadersSetting({ headerData }) {
  return (
    <>
      {headerData.length > 0 ? (
        headerData.map((header, index) => (
          <div key={index} className="mt-2 rounded-0 text-white" bg="dark">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between" style={{width: "90%"}}>
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
                  value={header.key}
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
                  value={header.value}
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
        <></>
      )}
    </>
  );
}

export default HeadersSetting;
