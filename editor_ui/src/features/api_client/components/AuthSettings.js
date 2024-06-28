import React from 'react'
import { Form } from 'react-bootstrap'
import Delete from '../../../assets/icons/delete-trash.svg'
function AuthSettings({authData}) {
  return (
    <>
      {authData.length > 0 ? (
        authData.map((auth, index) => (
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
                  value={auth.type}
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
                  value={auth.login_api}
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
                  value={auth.token_api}
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
  )
}

export default AuthSettings
