import { useState, useEffect } from 'react';
import { BreezeOffcanvas } from '../../../common/display';
import { CustomButtonField } from '../../../common/fields';
import DependencyForm from '../components/DependencyForm';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addThirdPartyDependencies,
  deleteThirdPartyDependencies,
  fetchThirdPartyDependencies,
  updateThirdPartyDependencies,
} from '../../../redux/third-party-dependencies/thirdPartyDependenciesActions';

function ThirdPartyDependencyConfig() {
  const dispatch = useDispatch();
  const { thirdPartyDependencies } = useSelector((state) => state.thirdPartyDependencies);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [selectedDependency, setSelectedDependency] = useState({ name: '', version: '*' });
  const [isEditMode, setIsEditMode] = useState(false);
  const { projectName } = useParams();

  useEffect(() => {
    if (thirdPartyDependencies.length === 0) {
      dispatch(fetchThirdPartyDependencies({ projectName }));
    }
  }, [dispatch, thirdPartyDependencies, projectName]);

  const handleOffcanvasClose = () => {
    setIsOffcanvasOpen(false);
    setSelectedDependency({ name: '', version: '*' });
    setIsEditMode(false);
  };

  const handleAddDependency = () => {
    setIsEditMode(false);
    setSelectedDependency({ name: '', version: '*' });
    setIsOffcanvasOpen(true);
  };

  const handleEditDependency = (dependency) => {
    setIsEditMode(true);
    setSelectedDependency(dependency);
    setIsOffcanvasOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (isEditMode) {
      await dispatch(updateThirdPartyDependencies({ projectName, payload: formData })).unwrap();
    } else {
      await dispatch(addThirdPartyDependencies({ projectName, payload: formData })).unwrap();
    }
    dispatch(fetchThirdPartyDependencies({ projectName }));
    handleOffcanvasClose();
  };

  const handleDeleteDependency = async (dependencyName) => {
    await dispatch(deleteThirdPartyDependencies({ projectName, payload: { name: dependencyName } }));
    dispatch(fetchThirdPartyDependencies({ projectName }));
  };

  return (
    <>
      <div className="p-2">
        <div className="d-flex justify-content-between">
          <h6 className="br-text-primary fw-bold mt-1">Third Party Dependencies</h6>
          <CustomButtonField
            type="button"
            label="Add"
            className="btn btn-filled med-font"
            onClick={handleAddDependency}
            icon={<i className="small-font bi bi-plus-circle me-1"></i>}
          />
        </div>

        <div className="dependency-list mt-3 px-3">
          {thirdPartyDependencies.map((dep) => (
            <div
              key={dep.name}
              className="dependency-card d-flex justify-content-between align-items-center p-2 border"
            >
              <div className="d-flex">
                <h6 className="me-2 mb-0">{dep.name} : </h6>
                <small className="fw-bold">{dep.version === '*' ? '* (latest)' : dep.version}</small>
              </div>
              <div>
                <i
                  className="bi bi-pencil-square br-cursor-pointer mx-2 color-blue"
                  onClick={() => handleEditDependency(dep)}
                  title="Edit"
                ></i>
                <i
                  className="bi bi-trash br-cursor-pointer mx-2 color-red"
                  onClick={() => handleDeleteDependency(dep.name)}
                  title="Delete"
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BreezeOffcanvas
        show={isOffcanvasOpen}
        onClose={handleOffcanvasClose}
        title={isEditMode ? 'Edit Dependency' : 'Add Dependency'}
        placement="end"
        size="30%"
      >
        <DependencyForm initialData={selectedDependency} isEditMode={isEditMode} onSubmit={handleSubmit} />
      </BreezeOffcanvas>
    </>
  );
}

export default ThirdPartyDependencyConfig;
