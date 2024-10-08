import { BreezeOffcanvas } from '../../../common/display';
import { CustomButtonField } from '../../../common/fields';
import { useState } from 'react';
import DependencyForm from '../components/DependencyForm';

function ThirdPartyDependencyConfig() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOffcanvasClose = () => {
    setIsOffcanvasOpen(false);
  };

  const handleAddDependency = () => {
    setIsOffcanvasOpen(true);
  };

  return (
    <>
      <div className="p-2">
        <div className="d-flex justify-content-between">
          <div>
            <h6 className="br-text-primary fw-bold mt-1">Third Party Dependencies</h6>
          </div>
          <div>
            <CustomButtonField
              type="button"
              label="Add"
              className="btn btn-filled med-font"
              onClick={handleAddDependency}
              icon={<i className="small-font bi bi-plus-circle me-1"></i>}
            />
          </div>
        </div>
      </div>

      <BreezeOffcanvas
        show={isOffcanvasOpen}
        onClose={handleOffcanvasClose}
        title="Add Dependency"
        placement="end"
        size="30%"
      >
        <>
          <DependencyForm />
        </>
      </BreezeOffcanvas>
    </>
  );
}

export default ThirdPartyDependencyConfig;
