import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { CustomButtonField, CustomCheckBoxField, CustomSelectField, CustomTextInput } from '../../../common/fields';
import { useDispatch, useSelector } from 'react-redux';

function GeneralSettingsCard({ settings, onChange, isAuthApi, selectedServiceInfo, onSuccessfulTransfer, moduleId }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const filesIdList = useSelector((state) => state.services.moduleList[moduleId]?.files);
  const { filesList } = useSelector((state) => state.services);

  const handleInputChange = (prop, value) => {
    onChange(prop, value);
  };
  const { projectName } = useParams();
  const convertToServiceApi = () => {
    setShowModal(!showModal);
  };
  const convertToAuthApi = async () => {
    setShowModal(!showModal);
  };
  const handleConversion = async () => {
    const payload = {
      filename: selectedServiceInfo.filename,
      id: selectedServiceInfo.serviceId,
      module_id: selectedServiceInfo.id,
    };
    await dispatch(convertToAuthApi({ projectName, payload })).unwrap();
    setShowModal(!showModal);
    onSuccessfulTransfer();
  };

  const filteredFiles = filesIdList ? filesIdList.map((fileId) => filesList[fileId]).filter((file) => file) : [];

  const transformedOptions = filteredFiles.map((file) => ({
    label: file.file,
    value: file.file,
    id: file.id,
  }));
  return (
    <>
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Convert to Auth</h5>
                <CustomButtonField label="" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>The contents of this File will be Lost!</p>
              </div>
              <div className="modal-footer">
                <CustomButtonField label="Cancel" className="btn btn-primary" onClick={() => setShowModal(false)} />
                <CustomButtonField label="Continue" className="btn btn-secondary" onClick={handleConversion} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-3">
        <div className=" br-background-secondary br-text-primary p-1">
          <span className="mx-2 ">General Settings</span>
        </div>
        <div className="row mt-2">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-3">
                <label className=" br-text-primary mx-3">Name:</label>
              </div>
              <div className="col-sm-9">
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Name"
                  value={settings.operation_id || ''}
                  onChange={(value) => handleInputChange('operation_id', value)}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-3">
                <label className=" br-text-primary mx-3">Summary:</label>
              </div>
              <div className="col-sm-9">
                <CustomTextInput
                  className="form-control br-form-control form-control-sm"
                  placeholder="Summary"
                  value={settings.summary || ''}
                  onChange={(value) => handleInputChange('summary', value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-sm-6">
            {!isAuthApi && (
              <div className="row">
                <div className="col-sm-3">
                  <label className=" br-text-primary mx-3">Service File:</label>
                </div>
                <div className="col-sm-9">
                  {transformedOptions.length > 0 ? (
                    <CustomSelectField
                      className="form-select br-form-select form-select-sm"
                      value={settings.tags || ''}
                      onChange={(value) => onChange('tags', value)}
                      options={transformedOptions}
                    />
                  ) : (
                    <CustomTextInput
                      className="form-control br-form-control form-control-sm"
                      placeholder="File Name"
                      value={settings.tags || ''}
                      onChange={(value) => handleInputChange('tags', value)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="col-sm-6">
            {isAuthApi ? (
              <>
                <div className="row">
                  <div className="col-sm-3">
                    <label className=" br-text-primary  mx-3">Authentication Type:</label>
                  </div>
                  <div className="col-sm-9">
                    <CustomSelectField
                      className="form-select br-form-select form-select-sm"
                      value={settings.authentication_type}
                      onChange={(value) => onChange('authentication_type', value)}
                      options={[
                        { label: 'Select', value: '' },
                        { label: 'Bearer', value: 'BEARER' },
                        { label: 'Basic', value: 'BASIC' },
                        { label: 'Oauth2', value: 'OAUTH2' },
                        { label: 'ApiKey', value: 'APIKEY' },
                      ]}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {selectedServiceInfo && Object.keys(selectedServiceInfo).length > 0 && settings.id && (
                  <div className="row">
                    <div className="col-sm-3">
                      <label className="br-text-primary mx-3">API Type:</label>
                    </div>
                    <div className="col-sm-9">
                      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        {/* <CustomRadioButtonField  /> */}
                        <input
                          type="radio"
                          className="btn-check"
                          name="btnradio"
                          id="btnradio1"
                          autoComplete="off"
                          onClick={convertToServiceApi}
                          checked={!isAuthApi}
                          disabled={!isAuthApi}
                        />
                        <label className="btn btn-outline-secondary br-text-primary" htmlFor="btnradio1">
                          Service API
                        </label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="btnradio"
                          id="btnradio2"
                          autoComplete="off"
                          onClick={convertToAuthApi}
                          disabled={isAuthApi}
                          checked={isAuthApi}
                        />
                        <label className="btn btn-outline-secondary br-text-primary" htmlFor="btnradio2">
                          Auth API
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {!isAuthApi ? (
          <div className="row mt-2">
            <div className="col-sm-6">
              <div className="row">
                <div className="col-sm-3">
                  <label className="br-text-primary mx-3">Requires Authentication?</label>
                </div>
                <div className="col-sm-9">
                  <CustomCheckBoxField
                    value={!settings.is_open_api}
                    onChange={(value) => onChange('is_open_api', !value)}
                    className="form-check-input br-form-check-input"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
GeneralSettingsCard.propTypes = {
  settings: PropTypes.shape({
    operation_id: PropTypes.string,
    tags: PropTypes.string,
    summary: PropTypes.string,
    authentication_type: PropTypes.string,
    is_open_api: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isAuthApi: PropTypes.bool.isRequired,
  selectedServiceInfo: PropTypes.shape({
    filename: PropTypes.string,
    serviceId: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  onSuccessfulTransfer: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
};
export default GeneralSettingsCard;
