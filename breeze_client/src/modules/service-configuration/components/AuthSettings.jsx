import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CustomSelectField } from '../../../common/fields';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveResponseTokens } from '../redux/ApiClientActions';

function AuthSettings({ authData, onChange, moduleId }) {
  const [auth, setAuth] = useState(authData ? (authData[0] ? authData[0] : {}) : {});
  const { projectName } = useParams();
  const { login_apis } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const setAuthApis = useCallback(
    async (moduleId) => {
      if (moduleId) {
        await dispatch(retrieveResponseTokens({ projectName, moduleId, apiId: null })).unwrap();
      }
    },
    [projectName, dispatch]
  );
  const handleChange = (value, field) => {
    const updatedAuthData = { ...auth };
    if (field === 'login_api') {
      const [operationId, tokenId] = value.split('-');
      const loginApi = login_apis.find((api) => api.operation_id === operationId);

      if (loginApi) {
        const apiId = loginApi.id;
        const apiType = loginApi.type;

        updatedAuthData[field] = apiId;
        updatedAuthData['token_id'] = tokenId;
        updatedAuthData['type'] = apiType;
      }
    } else {
      updatedAuthData[field] = value;
    }
    onChange('auth', [updatedAuthData]);
  };

  useEffect(() => {
    setAuthApis(moduleId);
  }, [setAuthApis, moduleId]);

  useEffect(() => {
    if (authData && authData.length > 0) setAuth(authData[0]);
  }, [authData]);

  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>
                {key}: {message}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const loginApiOptions = login_apis.map((api) => ({
    label: api.tokenKey,
    value: api.tokenKey,
    dataSource: 'authApi',
  }));
  loginApiOptions.push({ label: 'select', value: '' });
  return (
    <>
      <div id="main" className="d-flex mx-2">
        {auth.type === 'BASIC' ? (
          <>{/* Additional fields for BASIC auth can be added here */}</>
        ) : (
          <>
            <CustomSelectField
              name="loginApi"
              value={
                login_apis.find((api) => api.id === auth.login_api)
                  ? `${login_apis.find((api) => api.id === auth.login_api).operation_id}-${auth.token_id}`
                  : ''
              }
              onChange={(value) => handleChange(value, 'login_api')}
              options={loginApiOptions}
              className="form-select br-form-select form-select-sm"
              config={{
                label: 'Authentication Api',
                groupClass: 'form-group mb-2 mx-2 w-100',
              }}
            />
          </>
        )}
      </div>
      {renderError(auth.errors)} {/* Render any errors here */}
    </>
  );
}
AuthSettings.propTypes = {
  authData: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      login_api: PropTypes.string,
      token_id: PropTypes.string,
      errors: PropTypes.object,
    })
  ),
  onChange: PropTypes.func.isRequired,
  apiData: PropTypes.object,
  onApiChange: PropTypes.func,
  moduleId: PropTypes.string,
};

AuthSettings.defaultProps = {
  authData: [],
  apiData: {},
  onApiChange: () => {},
};
export default AuthSettings;
