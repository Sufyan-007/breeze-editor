import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CustomSelectField } from '../../../common/fields';
import { getResponseTokens } from '../services/IntermediateServices';

function AuthSettings({ authData, onChange, apiData, onApiChange, moduleId }) {
  const [auth, setAuth] = useState(authData ? (authData[0] ? authData[0] : {}) : {});
  const [loginApis, setLoginApis] = useState([]);
  const { projectName } = useParams();

  const setAuthApis = useCallback(async (moduleId) => {
    const result = await getResponseTokens(projectName, moduleId, null);
    let login_api = [];
    for (let api of result.data) {
      if (api.response_tokens) {
        for (const [key, config] of Object.entries(api.response_tokens)) {
          login_api.push({
            id: api.id,
            operation_id: api.operation_id,
            tokenKey: `${api.operation_id}-${key}`,
            tokenConfig: config,
          });
        }
      }
    }
    console.log(login_api, 'loginapidjfkdsjfklsdjf');
    setLoginApis(login_api);
  }, []);
  const handleChange = (value, field) => {
    const updatedAuthData = { ...auth };
    if (field === 'login_api') {
      const [operationId, tokenId] = value.split('-');
      const apiId = loginApis.find((api) => api.operation_id === operationId)?.id;
      updatedAuthData[field] = apiId;
      updatedAuthData['token_id'] = tokenId;
    } else {
      updatedAuthData[field] = value;
    }
    onChange('auth', [updatedAuthData]);
  };

  useEffect(() => {
    console.log(moduleId, 'moduleiddd');

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
  const authTypeOptions = [
    { label: 'Select', value: '' },
    { label: 'Bearer', value: 'BEARER' },
    { label: 'Oauth', value: 'OAUTH' },
    { label: 'Oauth2', value: 'OAUTH2' },
    { label: 'Basic', value: 'BASIC' },
    { label: 'ApiKey', value: 'APIKEY' },
  ];

  const loginApiOptions = loginApis.map((api) => ({
    label: api.tokenKey,
    value: api.tokenKey,
    dataSource: 'authApi',
  }));
  return (
    <>
      <div id="main" className="d-flex mx-2">
        <CustomSelectField
          name="authType"
          value={auth.type}
          onChange={(value) => handleChange(value, 'type')}
          options={authTypeOptions}
          className="form-select br-form-select form-select-sm"
          config={{
            label: 'Authentication Type',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />

        {auth.type === 'BASIC' ? (
          <>{/* Additional fields for BASIC auth can be added here */}</>
        ) : (
          <>
            <CustomSelectField
              name="loginApi"
              value={
                loginApis.find((api) => api.id === auth.login_api)
                  ? `${loginApis.find((api) => api.id === auth.login_api).operation_id}-${auth.token_id}`
                  : ''
              }
              onChange={(value) => handleChange(value, 'login_api')}
              options={loginApiOptions}
              className="form-select br-form-select form-select-sm"
              config={{
                label: 'Authentication Api',
                groupClass: 'form-group mb-2 mx-2 w-50',
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
  moduleId: PropTypes.string.isRequired,
};

AuthSettings.defaultProps = {
  authData: [],
  apiData: {},
  onApiChange: () => {},
};
export default AuthSettings;
