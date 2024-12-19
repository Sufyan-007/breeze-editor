import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CustomTextInput,
  CustomRadioButtonField,
  CustomSelectField,
  CustomButtonField,
} from '../../../../common/fields';
import { initialImportConfig } from '../../constants/ResourcesFormData';
import { ImportModules, ImportTypes } from '../../constants/FormConstants';
import { useOffcanvas } from '../../../../contexts/OffcanvasContext';
import { getImports, updateImports } from '../../../../services/components/componentService';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThirdPartyDependencies } from '../../../../redux/third-party-dependencies/thirdPartyDependenciesActions';

function ImportConfigForm({ fileId, updateFileCode }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialImportConfig);
  const [imports, setImports] = useState({ components: [], other: [] });
  const [editIndex, setEditIndex] = useState(null);
  const { closeOffcanvas } = useOffcanvas();
  const { projectName } = useParams();
  const { thirdPartyDependencies } = useSelector((state) => state.thirdPartyDependencies);

  const fetchImports = useCallback(async () => {
    const response = await getImports(projectName, { fileId });
    setImports(response || { components: [], other: [] });
  }, [fileId, projectName]);

  const thirdPartyOptions = useMemo(() => {
    return [
      { label: 'Select', value: '' },
      ...thirdPartyDependencies.map((dep) => ({
        label: `${dep.name} (${dep.version})`,
        value: dep.name,
      })),
    ];
  }, [thirdPartyDependencies]);

  useEffect(() => {
    if (thirdPartyDependencies.length === 0) {
      dispatch(fetchThirdPartyDependencies({ projectName }));
    }
  }, [dispatch, thirdPartyDependencies, projectName]);

  useEffect(() => {
    fetchImports();
  }, [fetchImports]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddImportClick = () => {
    setFormData(initialImportConfig);
    setEditIndex(null);
  };

  const handleEditImport = (category, index) => {
    const importToEdit = imports[category][index];
    setFormData(importToEdit);
    setEditIndex(index);
  };

  const handleDeleteImport = (category, index) => {
    const updatedCategory = [...imports[category]];
    updatedCategory.splice(index, 1);
    setImports((prev) => ({
      ...prev,
      [category]: updatedCategory,
    }));
    setEditIndex(null);
  };

  const handleSaveImport = () => {
    const updatedCategory = 'other';

    setImports((prev) => {
      const updatedImports = [...prev[updatedCategory]];

      if (editIndex !== null) {
        updatedImports[editIndex] = formData;
      } else {
        updatedImports.push(formData);
      }

      return { ...prev, [updatedCategory]: updatedImports };
    });

    setFormData(initialImportConfig);
    setEditIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateImports(projectName, { fileId, imports });
    fetchImports();
    closeOffcanvas();
    await updateFileCode();
  };

  const handleCancel = (fullCancel) => {
    setFormData(initialImportConfig);
    setEditIndex(null);
    if (fullCancel) {
      closeOffcanvas();
    }
  };

  return (
    <div className="import-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="d-flex h-100 mb-2">
          <div className="p-2 me-2 col-6 br-background-secondary h-100" style={{ borderRadius: '0.375rem' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="br-text-primary fw-semibold large-font">Imports</h6>
              <span className="badge breeze-badge me-0" onClick={handleAddImportClick}>
                <i className="small-font bi bi-plus-circle"></i>
                <span className="small-font ms-1">Add</span>
              </span>
            </div>
            {Object.keys(imports).map((category) => (
              <div key={category} className="mb-2">
                {imports[category].length > 0 && (
                  <ul className="br-text-primary med-font list-unstyled">
                    {imports[category].map((imp, index) => (
                      <li key={index} className="mb-2 mx-2 d-flex justify-content-between align-items-center">
                        <span>
                          <strong>{imp.import_entity}</strong> from <em>{imp.from}</em>
                        </span>
                        <div>
                          <i
                            className="bi bi-pencil-square me-3 cursor-pointer"
                            onClick={() => handleEditImport('other', index)}
                          ></i>
                          <i
                            className="bi bi-trash cursor-pointer"
                            onClick={() => handleDeleteImport('other', index)}
                          ></i>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div
            className="p-2 br-background-secondary col-6 h-100"
            style={{ borderRadius: '0.375rem', transition: 'width 0.3s ease' }}
          >
            <div>
              <CustomSelectField
                name="module"
                value={formData.module || ''}
                onChange={(value) => handleChange('module', value)}
                options={ImportModules}
                config={{
                  label: 'Category',
                  groupClass: 'form-group mb-2',
                }}
              />
              <CustomSelectField
                name="importFrom"
                value={formData.from || ''}
                onChange={(value) => handleChange('from', value)}
                options={thirdPartyOptions}
                config={{
                  label: 'Import From',
                  groupClass: 'form-group mb-2',
                }}
              />
              <CustomTextInput
                name="importEntity"
                value={formData.import_entity || ''}
                onChange={(value) => handleChange('import_entity', value)}
                config={{
                  label: 'Import Entity',
                  groupClass: 'form-group mb-2',
                }}
              />
              <label className="form-label br-text-primary med-font fw-semibold">Import Type</label>
              <CustomRadioButtonField
                name="importType"
                value={formData.import_type || 'FULL'}
                onChange={(value) => handleChange('import_type', value)}
                options={ImportTypes}
                config={{
                  label: 'Import Type',
                  groupClass: 'form-group',
                  className: 'form-check-input br-form-check-input me-1',
                  labelClass: 'form-label br-text-primary med-font fw-semibold me-2',
                }}
              />
              {/* <CustomSelectField
                name="category"
                value={formData.TYPE || 'THIRD_PARTY'}
                onChange={(value) => handleChange('TYPE', value)}
                options={ImportCategories}
                config={{
                  label: 'Category',
                  groupClass: 'form-group mb-2',
                }}
              /> */}
            </div>
            <div className="d-flex justify-content-end">
              <CustomButtonField
                type="button"
                label="Clear"
                className="btn br-secondary-button med-font mx-2"
                onClick={() => handleCancel(false)}
              />
              <CustomButtonField
                type="button"
                label="Save"
                className="btn br-secondary-button med-font"
                onClick={handleSaveImport}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label="Cancel"
            className="btn br-secondary-button med-font mx-2"
            onClick={() => handleCancel(true)}
          />
          <CustomButtonField type="button" label="Submit" className="btn btn-filled med-font" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

ImportConfigForm.propTypes = {
  fileId: PropTypes.string,
  updateFileCode: PropTypes.func,
};

export default ImportConfigForm;
