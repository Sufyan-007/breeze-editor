import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { getAuthFileConfig } from '../services/IntermediatesService';
import edit from "../assets/icons/edit.svg";
import Delete from "../assets/icons/delete.svg";
import Add from "../assets/icons/add.svg";
import AddOrEditAuthConfig from './AddOrEditAuthConfig';

function AuthenticationConfig() {
  const [auth_apis, setAuthApis] = useState({});
  const [showAddOrEditModal, setShowAddOrEditModal] = useState(false);
  const [showAuthConfig, setShowAuthConfig] = useState(true);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [mode, setMode] = useState("Add"); 
  const fetchAuthApis = async () => {
    try {
      const data = await getAuthFileConfig("creator");
      setAuthApis(data.data);
    } catch (error) {
      console.error('Error fetching auth APIs:', error);
    }
  };
  const available_apis = []
  useEffect(() => {
    fetchAuthApis();
  }, []);

  const handleAddApi = () => {
    setMode("Add")
    setShowAddOrEditModal(true);
    setShowAuthConfig(false)
  };
  const handleEditApi = (uuid) => {
    setSelectedUuid(uuid)
    setMode("Edit")
    setShowAddOrEditModal(true);
    setShowAuthConfig(false)
  };

  const handleDeleteApi = ()=>{
    setShowDeleteModal(false);
  }
  

  const handleClose = ()=>{
    fetchAuthApis()
    setSelectedUuid(null)
    setShowAddOrEditModal(false)
    setShowAuthConfig(true)
  }

  return (
    <>  
      {
        showAuthConfig && 
        <div className='mt-5 p-2' style={{maxWidth:"100%"}}>  
          { auth_apis ? 
          ( <>
            <div className='d-grid gap-2'>
              <Button variant='secondary' onClick={handleAddApi} size='lg' style={{}}>
                <img src={Add} alt="" height={24} className="mx-4" /> <span style={{ fontSize: 18 }}>Add a New API</span>
              </Button>
            </div>
            <Table striped bordered hover size='lg' className='mt-4' variant='dark'>  
              <thead>  
                <tr>   
                  <th rowSpan={2}>S.No</th>  
                  <th rowSpan={2}>Operation ID</th> 
                  <th colSpan={2} >Actions </th> 
                </tr>  
              </thead>  
              <tbody>  
                {Object.keys(auth_apis).map((key, index) => {
                  const api = auth_apis[key];
                  return (
                    <tr key={index}>  
                      <td>{index + 1}</td>  
                      <td>{api.operation_id}</td>
                      <td>
                        <img src={edit} alt="" height={24} className="mx-2" onClick={() => handleEditApi(api.id)} style={{cursor: "pointer"}} />
                        <img src={Delete} alt="" height={24} className="mx-2" onClick={() => setShowDeleteModal(true)} style={{cursor: "pointer"}} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>  
            </Table>  
          </>
          ) : (
            <Table striped bordered hover size='sm'>
              <thead>  
                <tr>   
                  <th>S.No</th>  
                  <th>Operation ID</th> 
                  <th>Actions</th> 
                </tr>  
              </thead>  
              <tbody>  
                <tr>  
                  <td colSpan={3} className='text-center align-middle'>
                    <span style={{ cursor: 'pointer' }} onClick={handleAddApi}>
                      {"NO Apis found. Create One"}<img src={Add} alt="" height={24} className="mx-4" />
                    </span>
                  </td>  
                </tr>  
              </tbody>  
            </Table>
          )}
        </div>
      }  
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered animation >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Authentication Configuration?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteApi}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {showAddOrEditModal && <div className='p-5'>
        <AddOrEditAuthConfig 
        availableApis={available_apis} 
        onClose={handleClose} 
        selectedUuid = {selectedUuid} 
        mode={mode} />
      </div>}
    </>  
  );
}

export default AuthenticationConfig;
