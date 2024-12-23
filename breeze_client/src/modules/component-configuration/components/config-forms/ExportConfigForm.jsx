import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import { initialExportConfig } from '../../constants/ResourcesFormData';
import { scopeOptions } from '../../constants/FormConstants';
import { CustomButtonField } from '../../../../common/fields';
import { getAstStatement, getExports, updateExports } from '../../../../services/components/componentService';
import { useParams } from 'react-router-dom';
import { useOffcanvas } from '../../../../contexts/OffcanvasContext';

function ExportConfigForm({ fileId, updateFileCode }) {
  const [formData, setFormData] = useState(initialExportConfig);
  const [exports, setExports] = useState({ default: '', others: [] });
  const [exportOptions, setExportOptions] = useState({});
  const { closeOffcanvas } = useOffcanvas();
  const { projectName } = useParams();

  const fetchExports = useCallback(async () => {
    const response = await getExports(projectName, { fileId });
    setExports(response || { default: '', others: [] });
    setFormData({
      default: response?.default,
      others: response?.others || [],
    });
  }, [fileId, projectName]);

  const fetchScope = useCallback(async () => {
    const response = await getAstStatement(projectName, { fileId, statementId: fileId });
    setExportOptions(response?.configMeta?.scope || {});
  }, [fileId, projectName]);

  useEffect(() => {
    fetchScope();
    fetchExports();
  }, [fetchExports, fetchScope]);

  // should be replaced by export options
  const options = Object.keys(scopeOptions).map((key) => ({
    value: scopeOptions[key],
    label: key,
  }));

  const handleDefaultChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      default: selectedOption.value,
    }));
  };

  const handleOthersChange = (selectedOptions) => {
    const updatedOthers = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      others: updatedOthers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedExports = {
      default: formData.default,
      others: formData.others.length > 0 ? formData.others : [],
    };
    await updateExports(projectName, { fileId, exports: updatedExports });
    closeOffcanvas();
    await updateFileCode();
  };

  const handleCancel = () => {
    setFormData({
      default: exports.default,
      others: exports.others,
    });
    closeOffcanvas();
  };

  return (
    <div className="import-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div className="mb-3">
            <label className="form-label br-text-primary med-font fw-semibold">Default Export</label>
            <Select
              options={options}
              value={options.find((opt) => opt.value === formData.default)}
              onChange={handleDefaultChange}
              placeholder="Select default"
              className="react-select-container br-background-secondary br-text-primary"
              classNamePrefix="react-select"
            />
          </div>

          <div className="mb-3">
            <label className="form-label br-text-primary med-font fw-semibold">Other Exports</label>
            <Select
              options={options}
              isMulti
              value={formData.others.map((value) => options.find((option) => option.value === value))}
              onChange={handleOthersChange}
              placeholder="Select others"
              className="react-select-container br-background-secondary br-text-primary"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label={'Cancel'}
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField
            type="button"
            label={'Submit'}
            className="btn btn-filled med-font"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

ExportConfigForm.propTypes = {
  fileId: PropTypes.string.isRequired,
  updateFileCode: PropTypes.func,
};

export default ExportConfigForm;
