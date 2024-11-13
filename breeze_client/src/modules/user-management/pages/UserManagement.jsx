import { useState } from 'react';
import Navbar from '../../../common/navbar/Navbar';
import CustomTable from '../../../common/display/datatable/BreezeCustomTable';
import BreezeOffCanvas from '../../../common/display/offcanvas/BreezeOffcanvas';
import { CustomButtonField } from '../../../common/fields';
import AddNewUser from '../components/AddNewUser';
import { addUser } from '../services/UserManagementService';

const UserManagement = () => {
  const [data, setData] = useState([
    { id: 1, username: 'John Doe', projects: ['Project A, Project B'], roles: ['Admin'] },
    { id: 2, username: 'Jane Smith', projects: ['Project B'], roles: ['User'] },
    { id: 3, username: 'Bob Johnson', projects: ['Project C'], roles: ['Manager'] },
    { id: 4, username: 'Alice Davis', projects: ['Project D'], roles: ['User'] },
    { id: 5, username: 'Mike Brown', projects: ['Project E'], roles: ['Admin'] },
  ]);

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone_number: '',
    roles: [],
    projects: [],
    password: '',
    confirmPassword: '',
  });

  const columns = [
    { header: 'User Name', accessor: 'username' },
    {
      header: 'Projects',
      accessor: 'projects',
      render: (row) => {
        if (Array.isArray(row.projects) && row.projects.length > 0) {
          return row.projects.join(', ');
        }
        return 'No Projects';
      },
    },
    {
      header: 'Role',
      accessor: 'roles',
      render: (row) => {
        if (Array.isArray(row.roles) && row.roles.length > 0) {
          return row.roles.join(', ');
        }
        return 'No Roles';
      },
    },
  ];

  const handleAddUserClick = () => {
    setIsOffcanvasOpen(true);
  };

  const handleUserSubmit = async (newUser) => {
    if (!newUser.projects || !Array.isArray(newUser.projects)) {
      newUser.projects = [];
    }

    try {
      const registeredUser = await addUser(newUser);
      console.log(registeredUser);

      // setData((prevData) => [
      //   ...prevData,
      //   {
      //     id: registeredUser.id,
      //     username: registeredUser.username,
      //     projects: registeredUser.projects,
      //     roles: registeredUser.roles,
      //   },
      // ]);

      clearForm();
      setIsOffcanvasOpen(false);
    } catch (error) {
      console.error('User registration failed:', error.message);
    }
  };

  const clearForm = () => {
    setUserData({
      username: '',
      email: '',
      phone_number: '',
      roles: [],
      projects: [],
      password: '',
      confirmPassword: '',
    });
  };

  const handleOffcanvasClose = () => {
    clearForm();
    setIsOffcanvasOpen(false);
  };

  return (
    <div className="container-fluid vh-100 p-0 br-background-secondary">
      <Navbar />
      <div className="br-text-primary fw-bold p-3 d-flex justify-content-between">
        <h3>User Management</h3>
        <CustomButtonField
          label="Add User"
          onClick={handleAddUserClick}
          className="btn br-background-primary br-text-primary btn-sm me-2"
        />
      </div>
      <div className="p-3">
        <CustomTable columns={columns} data={data} currentPage={1} pageSize={10} />
      </div>
      <BreezeOffCanvas
        show={isOffcanvasOpen}
        title="Add New User"
        placement="end"
        size="700px"
        onClose={handleOffcanvasClose}
      >
        <AddNewUser
          userData={userData}
          setUserData={setUserData}
          onSubmit={handleUserSubmit}
          onCancel={handleOffcanvasClose}
        />
      </BreezeOffCanvas>
    </div>
  );
};

export default UserManagement;
