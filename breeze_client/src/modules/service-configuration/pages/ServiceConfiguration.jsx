import { useCallback, useEffect, useState } from 'react';
// import { useParams } from 'react-router';
import ImportApi from '../components/ImportApi';
import GeneralSettingsCard from '../components/GeneralSettingsCard';
import RequestSettings from '../components/RequestSettings';
import ResponseSettings from '../components/ResponseSettings';
import { generateService } from '../services/GeneratedService';
import SideBar from '../components/SideBar';
import { CustomButtonField, CustomSelectField } from '../../../common/fields';
import {
  convertSwagger,
  editFunctionConfig,
  fetchIntermediates,
  editModuleName,
} from '../services/IntermediateServices';

function Test() {
  const [apiList, setApiList] = useState([]);
  const [selectedApi, setSelectedApi] = useState({});
  const [selectedAuthApi, setSelectedAuthApi] = useState({});
  // const { projectName } = useParams();
  const [view, setView] = useState('TEST');
  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [transformedOptions, setTransformedOptions] = useState([]);
  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediates('abcc', { category: 'api_client' });
      const apiList = Object.entries(result.data).map(([key, value]) => ({
        id: key,
        title: value.title,
      }));
      const options = Object.entries(result.data).map(([key, value]) => ({
        label: value.title,
        value: value.title,
        moduleId: key,
      }));
      setTransformedOptions(options);
      setApiList(apiList);
    } catch (error) {
      console.error('Error generating react service:', error);
    }
  }, []);

  const generateServiceFile = async (fileType, filename, moduleId) => {
    try {
      const result = await generateService(fileType, 'abcc', { filename, moduleId });
      console.log(result, 'result');
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

  const handleUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await convertSwagger('abcc', fileType, formData);
      if (response.files_with_apis) {
        fetchServiceList();
        setShow(false);
        setView('TEST');
        event.target.value = '';
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e, isAuthApi = false) => {
    const selectedApiModel = isAuthApi ? selectedAuthApi : selectedApi;
    console.log(selectedApiModel, 'selectedApiModel');
    if (!isValidApiStructure(selectedApiModel)) {
      setShowToast(true);
      setErrorMessage('Please Fill All the Values before Submitting');
      return;
    }
    if (!selectedModule) {
      setShowToast(true);
      setErrorMessage('Please Select a Module first');
      return;
    }
    e.preventDefault();
    let operation = selectedApiModel.id ? 'UPDATE' : 'ADD';
    if (isAuthApi) {
      selectedApiModel.tags = 'auth';
      await editFunctionConfig('abcc', operation, {
        moduleId: selectedModule.id,
        api_type: 'AUTH',
        api_data: selectedApiModel,
      });
    } else {
      await editFunctionConfig('abcc', operation, {
        moduleId: selectedModule.id,
        api_type: 'ORDINARY',
        api_data: selectedApiModel,
        filename: selectedFile,
      });
    }
    if (isAuthApi) {
      setSelectedAuthApi({});
    } else {
      setSelectedApi({});
    }
    fetchServiceList();
  };

  const isValidApiStructure = (api) => {
    console.log(api, 'api submitted');
    if (!api) return false;
    const hasRequiredTopLevelProps = api.operation_id && api.tags;
    if (!hasRequiredTopLevelProps) return false;
    console.log('top level');

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
    fetchServiceList();
  }, [fetchServiceList]);

  const saveTitle = async (oldTitle, moduleId, newTitle) => {
    if (oldTitle !== newTitle) {
      const result = await editModuleName('abcc', { title: newTitle, moduleId: moduleId });
      if (result.message) {
        setShowToast(true);
        setErrorMessage(result.message);
      }
      fetchServiceList();
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
            <div className="toast-body">{errorMessage}</div>
          </div>
        </div>
      )}

      <div className="row h-100 br-background-primary">
        <div
          className="col-sm-2 "
          style={{
            borderRight: '1px solid rgba(128, 128, 128, 0.5)',
          }}
        >
          <SideBar
            apiList={apiList}
            setView={setView}
            setSelectedApi={setSelectedApi}
            setSelectedAuthApi={setSelectedAuthApi}
            saveTitle={saveTitle}
            generateService={generateServiceFile}
            setSelectedModule={setSelectedModule}
            setSelectedFile={setSelectedFile}
          />
        </div>
        <div className="col-sm-10">
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
                  fetchServiceList();
                  setErrorMessage('Function Transferred Successfully');
                  setShowToast(true);
                }}
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

              <GeneralSettingsCard settings={selectedAuthApi} onChange={onAuthApiModelChange} isAuthApi={true} />
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Test;
