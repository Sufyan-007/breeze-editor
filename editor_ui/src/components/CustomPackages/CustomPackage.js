import React from 'react'
import {Table} from "react-bootstrap"

function CustomPackage() {
  return (
    <div>
      <>
        <div className="container-fluid text-white">
          <div className="col-12 my-3 px-4 d-flex justify-content-between">
            <h3>Custom Packages</h3>
            <div className='d-flex'>
                <button
                className='btn btn-secondary mx-2'
                onClick={()=>{
                   
                }}
                >
                Upload Zip
                </button>
            </div>
          </div>
          <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>File Path</th>
                    <th style={{width: "5%"}}>Actions</th>
                </tr>
            </thead>

          </Table>
        </div>
      </>
    </div>
  );
}

export default CustomPackage
