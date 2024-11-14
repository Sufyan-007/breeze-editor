import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImportApi from '../components/ImportApi';
import GeneralSettingsCard from '../components/GeneralSettingsCard';
import RequestSettings from '../components/RequestSettings';
import ResponseSettings from '../components/ResponseSettings';
import SideBar from '../components/SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButtonField, CustomSelectField } from '../../../common/fields';
import {
  fetchModules,
  convertFile,
  editFunction,
  editModule,
  generateServices,
  fetchFunctions,
  fetchFiles,
} from '../redux/ApiClientActions';
import AddModule from '../components/AddModule';
function ServiceConfiguration() {
  const { transformedOptions, message } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const [selectedApi, setSelectedApi] = useState({});
  const [selectedAuthApi, setSelectedAuthApi] = useState({});
  const { projectName } = useParams();
  const [view, setView] = useState('TEST');
  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const generateServiceFile = async (type, filename, moduleId) => {
    try {
      const payload = { filename, moduleId };
      await dispatch(generateServices({ type, projectName, payload })).unwrap();
    } catch (error) {
      console.error('Error generate react service:', error);
    }
  };

  const onApiModelChange = (prop, value) => {
    let model = { ...selectedApi };
    model[prop] = value;
    setSelectedApi({ ...model });
  };

  const onAuthApiModelChange = (prop, value) => {
    let model = { ...selectedAuthApi };
    model[prop] = value;
    setSelectedAuthApi({ ...model });
  };

  const handleUpload = async (event, collectionType) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const payload = { category: 'api_client' };
      const newModuleId = await dispatch(convertFile({ projectName, collectionType, formData })).unwrap();
      setShow(false);
      setView('TEST');
      await dispatch(fetchModules({ projectName, payload })).unwrap();
      const res = await dispatch(
        fetchFiles({ projectName, payload: { category: 'api_client', module: newModuleId.module_id } })
      ).unwrap();
      const fileIds = Object.keys(res.data);
      const fetchFunctionsPromises = fileIds.map((fileId) =>
        dispatch(fetchFunctions({ projectName, payload: { category: 'api_client', fileId } }))
      );

      await Promise.all(fetchFunctionsPromises);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e, isAuthApi = false) => {
    const selectedApiModel = isAuthApi ? selectedAuthApi : selectedApi;
    console.log(selectedApiModel, 'selectedApiModel');
    if (!isValidApiStructure(selectedApiModel)) {
      setShowToast(true);
      return;
    }
    if (!selectedModule) {
      setShowToast(true);
      return;
    }
    e.preventDefault();
    let operation = selectedApiModel.id ? 'UPDATE' : 'ADD';
    if (isAuthApi) {
      selectedApiModel.tags = 'auth';
      const payload = {
        moduleId: selectedModule.id,
        api_type: 'AUTH',
        api_data: selectedApiModel,
      };
      await dispatch(editFunction({ projectName, operation, payload })).unwrap();
    } else {
      const payload = {
        moduleId: selectedModule.id,
        api_type: 'ORDINARY',
        api_data: selectedApiModel,
        filename: selectedFile,
      };
      await dispatch(editFunction({ projectName, operation, payload })).unwrap();
    }
    await dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
    if (operation === 'ADD') {
      dispatch(fetchFiles({ projectName, payload: { category: 'api_client', module: selectedModule.id } })).unwrap();
    }
    await dispatch(
      fetchFunctions({
        projectName,
        payload: { category: 'api_client', files: selectedFile, module: selectedModule.id },
      })
    ).unwrap();
    if (isAuthApi) {
      setSelectedAuthApi({});
    } else {
      setSelectedApi({});
    }
  };

  const isValidApiStructure = (api) => {
    if (!api) return false;
    if (!api.operation_id) return false;
    // if (!api.tags) return false;
    if (api.request) {
      const hasValidRequestProps =
        api.request.method &&
        api.request.url &&
        Array.isArray(api.request.parameters) &&
        Array.isArray(api.request.body);
      if (!hasValidRequestProps) return false;
      console.log('request props');
      const url = api.request.url;
      const hasRequiredUrlProps = url.path && url.baseurl;
      if (!hasRequiredUrlProps) return false;
      console.log('url');
      if (!Array.isArray(url.path)) return false;
      for (const param of api.request.parameters) {
        const hasRequiredParamProps = param.param_in && param.name && param.type && param.param_type;
        if (!hasRequiredParamProps) return false;
      }
      console.log('params');

      for (const body of api.request.body) {
        const hasRequiredBodyProps = body.content_type && body.mode;
        if (!hasRequiredBodyProps) return false;
      }
    }
    if (api.response) {
      for (const resp of api.response) {
        const hasRequiredResponseProps = resp.content_type && resp.status;
        if (!hasRequiredResponseProps) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const payload = { category: 'api_client' };
    dispatch(fetchModules({ projectName, payload })).unwrap();
  }, [dispatch, projectName]);

  const saveTitle = async (oldTitle, moduleId, newTitle) => {
    if (oldTitle !== newTitle) {
      const payload = { title: newTitle, moduleId: moduleId };
      await dispatch(editModule({ projectName, payload })).unwrap();
      dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
    }
  };

  const handleModuleSelect = (selectedOption) => {
    if (selectedOption) {
      const { label: moduleName, moduleId } = selectedOption;
      setSelectedModule({ name: moduleName, id: moduleId });
    }
  };
  return (
    <div className="container-fluid h-100 overflow-auto">
      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3 br-background-primary" style={{ zIndex: 1 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Message</strong>
              <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
            </div>
            <div className="toast-body">{message}</div>
          </div>
        </div>
      )}

      <div className="row h-100 br-background-primary">
        <div
          className="col-sm-3 "
          style={{
            borderRight: '1px solid rgba(128, 128, 128, 0.5)',
          }}
        >
          <SideBar
            setView={setView}
            setSelectedApi={setSelectedApi}
            setSelectedAuthApi={setSelectedAuthApi}
            saveTitle={saveTitle}
            generateService={generateServiceFile}
            setSelectedModule={setSelectedModule}
            setSelectedFile={setSelectedFile}
            selectedModule={selectedModule}
          />
        </div>
        <div className="col-sm-9">
          {view === 'TEST' ? (
            <>
              <div className="d-flex justify-content-between">
                <h5 className=" br-text-primary mt-4">Service Function Configuration</h5>
                <div className="d-flex align-items-center">
                  <CustomSelectField
                    name="moduleSelect"
                    value={selectedModule ? selectedModule.name : ''}
                    onChange={handleModuleSelect}
                    options={transformedOptions}
                    className="form-select br-form-select form-select-sm mt-3"
                    sendSelectedOption={true}
                  />
                  <CustomButtonField
                    className="btn br-background-secondary br-text-primary mt-3 rounded-0 mx-3"
                    onClick={(e) => handleSubmit(e, false)}
                    label="Submit"
                  />
                </div>
              </div>
              <GeneralSettingsCard
                selectedServiceInfo={selectedModule}
                settings={selectedApi}
                onChange={onApiModelChange}
                isAuthApi={false}
                onSuccessfulTransfer={() => {
                  setShowToast(true);
                }}
                moduleId={selectedModule && selectedModule.id}
              />
              <RequestSettings
                moduleId={selectedModule && selectedModule.id}
                requestData={selectedApi.request ? selectedApi.request : {}}
                onChange={onApiModelChange}
                apiData={selectedApi}
                isAuthApi={false}
                title="Request Settings"
                requestType="request"
              />
              <ResponseSettings
                responseData={selectedApi.response ? selectedApi.response : []}
                onChange={onApiModelChange}
                moduleId={selectedModule && selectedModule.id}
                isAuthApi={false}
                title="Response Settings"
                responseType="response"
              />
            </>
          ) : view === 'AUTH_API' ? (
            <>
              <div className="d-flex justify-content-between">
                <h5 className="br-text-primary mt-4">Auth Api Configuration</h5>
                <div className="d-flex align-items-center">
                  <CustomSelectField
                    name="moduleSelect"
                    value={selectedModule ? selectedModule.name : ''}
                    onChange={handleModuleSelect}
                    options={transformedOptions}
                    className="form-select br-form-select form-select-sm mt-3"
                    sendSelectedOption={true}
                  />
                  <CustomButtonField
                    className="btn br-background-secondary br-text-primary mt-3 rounded-0 mx-3"
                    onClick={(e) => handleSubmit(e, true)}
                    label="Submit"
                  />
                </div>
              </div>

              <GeneralSettingsCard
                settings={selectedAuthApi}
                onChange={onAuthApiModelChange}
                isAuthApi={true}
                moduleId={selectedModule && selectedModule.id}
              />
              <div>
                <RequestSettings
                  requestData={selectedAuthApi.request ? selectedAuthApi.request : {}}
                  onChange={onAuthApiModelChange}
                  apiData={selectedAuthApi}
                  isAuthApi={true}
                  title="Request Settings"
                  requestType="request"
                  moduleId={selectedModule && selectedModule.id}
                />
                <ResponseSettings
                  responseData={selectedAuthApi.response ? selectedAuthApi.response : []}
                  onChange={onAuthApiModelChange}
                  moduleId={selectedModule && selectedModule.id}
                  isAuthApi={true}
                  title="Response Settings"
                  responseType="response"
                />
              </div>
            </>
          ) : view === 'IMPORT_API' ? (
            <ImportApi
              show={true}
              onImport={handleUpload}
              onClose={() => {
                setView('TEST');
                setShow(!show);
              }}
            />
          ) : view === 'ADD_MODULE' ? (
            <AddModule setView={setView} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ServiceConfiguration;
