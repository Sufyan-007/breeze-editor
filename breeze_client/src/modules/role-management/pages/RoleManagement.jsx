import { useState } from 'react';
import Navbar from '../../../common/navbar/Navbar';
import CustomTable from '../../../common/display/datatable/BreezeCustomTable';
import { CustomButtonField } from '../../../common/fields';
import BreezeOffCanvas from '../../../common/display/offcanvas/BreezeOffcanvas';
import AddNewRole from '../components/AddNewRole';

const RoleManagement = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, roles: 'Admin', accessibility: 'Full Access' },
    { id: 2, roles: 'Editor', accessibility: 'Edit Access' },
    { id: 3, roles: 'Viewer', accessibility: 'Read-Only Access' },
  ]);

  const columns = [
    { header: 'Role', accessor: 'roles' },
    { header: 'Accessibility', accessor: 'accessibility' },
  ];

  const handleAddVariable = () => {
    setIsOffcanvasOpen(true);
  };

  const handleAddNewRoleSubmit = (newRole) => {
    setRoles([
      ...roles,
      { id: roles.length + 1, roles: newRole.roleName, accessibility: newRole.selectedFeatures.join(', ') },
    ]);
    setIsOffcanvasOpen(false);
  };

  return (
    <div className="container-fluid vh-100 p-0 br-background-secondary">
      <Navbar />
      <div className="br-text-primary fw-bold p-3 d-flex justify-content-between">
        <h3>Role Management</h3>
        <CustomButtonField
          label="Add New Role"
          onClick={handleAddVariable}
          className="btn br-background-primary br-text-primary btn-sm me-2"
        />
      </div>
      <div className="p-3">
        <CustomTable columns={columns} data={roles} />
      </div>
      <BreezeOffCanvas
        show={isOffcanvasOpen}
        title="Add New Role"
        placement="end"
        size="450px"
        onClose={() => setIsOffcanvasOpen(false)}
      >
        <AddNewRole onSubmit={handleAddNewRoleSubmit} onCancel={() => setIsOffcanvasOpen(false)} />
      </BreezeOffCanvas>
    </div>
  );
};

export default RoleManagement;
