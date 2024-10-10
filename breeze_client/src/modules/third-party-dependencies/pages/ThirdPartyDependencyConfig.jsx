import { useState, useEffect, useCallback } from 'react';
import { BreezeOffcanvas } from '../../../common/display';
import { CustomButtonField } from '../../../common/fields';
import DependencyForm from '../components/DependencyForm';
import {
  addThirdPartyDependency,
  deleteThirdPartyDependency,
  getThirdPartyDependencies,
  updateThirdPartyDependency,
} from '../services/ThirdPartyDependenciesService';
import { useParams } from 'react-router-dom';

function ThirdPartyDependencyConfig() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [dependencies, setDependencies] = useState([]);
  const [selectedDependency, setSelectedDependency] = useState({ name: '', version: '*' });
  const [isEditMode, setIsEditMode] = useState(false);
  const { projectName } = useParams();

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

  const handleDeleteDependency = async (dependencyName) => {
    await deleteThirdPartyDependency(projectName, { name: dependencyName });
    loadDependencies();
  };

  const handleSubmit = async (formData) => {
    if (isEditMode) {
      await updateThirdPartyDependency(projectName, formData);
    } else {
      await addThirdPartyDependency(projectName, formData);
    }
    loadDependencies();
    handleOffcanvasClose();
  };

  const loadDependencies = useCallback(async () => {
    const data = await getThirdPartyDependencies(projectName);
    const transformedData = Object.entries(data).map(([name, version]) => ({
      name,
      version,
    }));

    setDependencies(transformedData);
  }, [projectName]);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

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
          {dependencies.map((dep) => (
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
