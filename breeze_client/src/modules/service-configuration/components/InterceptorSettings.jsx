import { useContext } from 'react';
import { CustomSelectField, CustomTextInput, MonacoEditor } from '../../../common/fields';
import ThemeContext from '../../../contexts/ThemeContext';
import { useSelector } from 'react-redux';

function InterceptorSettings({ moduleId, selectedApi }) {
  const interceptors = useSelector((state) => state.services.moduleList[moduleId]?.interceptors);
  const currentInterceptor = interceptors?.find((interceptor) => interceptor.id === selectedApi.interceptor_id);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const handleInterceptorsChange = (field, value) => {
    const updatedInterceptors = { ...currentInterceptor };
    updatedInterceptors[field] = value;
  };
  if (!currentInterceptor) {
    return (
      <div className="row mt-3">
        <div className="br-text-primary br-background-secondary p-1">
          <span className="mx-2" style={{ fontSize: '16px' }}>
            {'No Interceptors Generated Yet'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row mt-3">
        <div className="br-text-primary br-background-secondary p-1">
          <span className="mx-2" style={{ fontSize: '16px' }}>
            {'Interceptor Settings'}
          </span>
        </div>
      </div>
      <div
        className="my-2 mx-1 ps-1 card br-background-secondary rounded-0"
        style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
      >
        <div className="row p-1">
          <div className="col-sm-2 br-text-primary">Name:</div>
          <div className="col-sm-10">
            <CustomTextInput
              value={currentInterceptor.name}
              onChange={(val) => {
                handleInterceptorsChange('name', val);
              }}
              className="form-control br-form-control form-control-sm my-1"
            />
          </div>
        </div>
        <div className="row p-1">
          <div className="col-sm-2 br-text-primary">Type:</div>
          <div className="col-sm-10">
            <CustomSelectField
              name="type"
              value={currentInterceptor.type}
              options={[
                { label: 'Select', value: '' },
                { label: 'Request', value: 'REQUEST' },
                { label: 'Response', value: 'RESPONSE' },
              ]}
              className="form-select br-form-select form-select-sm"
            />
          </div>
        </div>
        <div className="row p-1">
          <div className="col-sm-2 br-text-primary">Interceptor:</div>
          <div className="col-sm-10">
            <MonacoEditor
              id="interceptor-editor"
              defaultValue={currentInterceptor.interceptorCode}
              language="javascript"
              height="100px"
              theme={projectTheme}
              config={{ label: 'Interceptor Code' }}
            />
          </div>
        </div>
        {/* Optional: Error section if you need it */}
        {/* <div className="row p-1">
          <div className="col-sm-2 br-text-primary">Error:</div>
          <div className="col-sm-10">
            <MonacoEditor
              id="error-editor"
              defaultValue={currentInterceptor.errorCode}
              language="javascript"
              height="70px"
              theme={projectTheme}
              config={{ label: 'Error Code' }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default InterceptorSettings;
