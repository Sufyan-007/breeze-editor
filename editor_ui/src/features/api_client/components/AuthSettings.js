import React from 'react'
import { Form } from 'react-bootstrap'
import Delete from '../../../assets/icons/delete-trash.svg'
function AuthSettings({authData, onChange}) {
  const handleInputChange = (index, field, value) => {
    const updatedAuth = [...authData];
    updatedAuth[index] = { ...updatedAuth[index], [field]: value };
    onChange("auth", updatedAuth);
  };

  const handleDelete = (index) => {
    const updatedAuth = [...authData];
    updatedAuth.splice(index, 1);
    onChange("auth", updatedAuth);
  };
  return (
    <>
      {authData && authData.length > 0 ? (
        authData.map((auth, index) => (
          <div
            key={index}
            className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
            <div style={{ width: "90%" }} className="d-flex align-items-center">
              <div className="mx-3" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Type:</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Key"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={auth.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
                />
              </div>
              <div className="mx-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Login Api:</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Value"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={auth.login_api}
                  onChange={(e) =>
                    handleInputChange(index, "login_api", e.target.value)
                  }
                />
              </div>
              <div className="mx-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Token Api:</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Value"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={auth.token_api}
                  onChange={(e) =>
                    handleInputChange(index, "token_api", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <img
                alt="delete"
                className="mt-4"
                height={25}
                width={25}
                src={Delete}
                onClick={() => handleDelete(index)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <span className="text-white">-----No Auth Present-----</span>
        </div>
      )}
    </>
  );
}

export default AuthSettings
