import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HeadersSetting from './HeadersSettings';
import AuthSettings from './AuthSettings';
import UrlSettings from './UrlSettings';
import BodySettings from './BodySettings';
import { fetchEnvironmentConfig } from '../../../redux/settings/settingsActions';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function RequestSettings({ requestData, onChange, apiData, isAuthApi, title, requestType, moduleId }) {
  const [request, setRequest] = useState(requestData);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [api, setApi] = useState({});
  const [requestProperties, setRequestProperties] = useState(['Url', 'Body', 'Headers', 'Auth']);
  const { environmentSettingsConfig, status } = useSelector((state) => state.environment);

  const envVars = environmentSettingsConfig?.envVars;

  const { projectName } = useParams();
  const [urlHeading, setUrlHeading] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (requestData.method === 'GET') {
      setRequestProperties(['Url', 'Headers', 'Auth']);
    } else {
      setRequestProperties(['Url', 'Headers', 'Auth', 'Body']);
    }
  }, [requestData.method]);

  useEffect(() => {
    if (isAuthApi) {
      if (
        apiData.authentication_type === 'BEARER' ||
        apiData.authentication_type === 'APIKEY' ||
        apiData.authentication_type === 'OAUTH2'
      ) {
        setRequestProperties(['Url', 'Body', 'Headers']);
      } else if (apiData.authentication_type === 'BASIC') {
        setRequestProperties(['Body', 'Headers']);
      }
    } else if (apiData.is_open_api) {
      setRequestProperties(['Url', 'Body', 'Headers']);
      const updatedRequest = { ...requestData };
      updatedRequest.auth = [];
      setRequest(updatedRequest);
    } else if (apiData?.request?.method === 'GET') {
      setRequestProperties(['Url', 'Auth', 'Headers']);
    } else {
      setRequestProperties(['Url', 'Body', 'Headers', 'Auth']);
    }
  }, [isAuthApi, apiData.authentication_type, apiData.is_open_api, requestData, apiData.request?.method]);

  useEffect(() => {
    if (status === 'ready') {
      dispatch(fetchEnvironmentConfig({ projectName }));
    }
  }, [dispatch, projectName, status]);
  const addProperty = (e, prop) => {
    let newData = null;
    if (prop === 'query parameters') {
      prop = 'parameters';
      const newParam = {
        name: '',
        param_in: 'QUERY',
        type: 'STRING',
        required: false,
        description: '',
      };
      if (!requestData.parameters) {
        requestData.parameters = [];
      }
      newData = [...requestData.parameters, newParam];
    } else if (prop === 'headers') {
      const newHeader = { key: '', value: '' };
      if (!requestData.headers) {
        requestData.headers = [];
      }
      newData = [...requestData.headers, newHeader];
    } else if (prop === 'auth') {
      const newAuth = {
        type: '',
        contents: [],
        login_api: '',
        token_api: null,
        errors: null,
      };
      if (!requestData.auth) {
        requestData.auth = [];
      }
      newData = [...requestData.auth, newAuth];
    }
    onReqChange(prop, newData);
  };

  useEffect(() => {
    setRequest(requestData);
    let baseUrl = requestData?.url?.baseurl;
    const env_label = requestData?.url?.env_label;
    console.log(env_label, 'envlabel');

    if (env_label) {
      baseUrl = env_label;
    }
    const pathSegments = requestData?.url?.path || [];
    const allParams = requestData?.parameters || [];
    const fullPath = pathSegments.filter((segment) => segment).join('/');
    const queryParams = allParams
      .filter((param) => param.param_in === 'QUERY' && param.value) // Filter for QUERY params that have values
      .map((param) => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`)
      .join('&');
    const sanitizedBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const fullUrl = `${sanitizedBaseUrl}/${fullPath}${queryParams ? '?' + queryParams : ''}`;
    setUrlHeading(sanitizedBaseUrl ? fullUrl : 'Url');
  }, [requestData]);

  useEffect(() => {
    setApi(apiData);
  }, [apiData]);

  const onReqChange = (prop, value) => {
    let r = { ...request };
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange(requestType, r);
  };

  const toggleProperty = (index) => {
    if (expandedProperty === index) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(index);
    }
  };

  return (
    <div className="row mt-3 ">
      <div className=" br-text-primary br-background-secondary p-1">
        <span className="mx-2" style={{ fontSize: '16px' }}>
          {title}
        </span>
      </div>
      <div className="p-1">
        {requestProperties &&
          requestProperties.map((req, index) => (
            <div
              key={index}
              className="card mt-1 rounded-0 br-text-primary br-background-secondary"
              style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
            >
              <div className="card-body d-flex justify-content-between" onClick={() => toggleProperty(index)}>
                <div style={{ fontSize: '14px' }}>
                  {req === 'Url' ? urlHeading : req}
                  {req === 'Url'
                    ? ((request?.parameters &&
                        request?.parameters.some((param) => param.errors && Object.keys(param.errors).length > 0)) ||
                        (request?.url && request.url.errors && Object.keys(request?.url?.errors).length > 0)) && (
                        <i className="bi bi-exclamation-circle mx-2" style={{ color: 'red' }}></i>
                      )
                    : request[req.toLowerCase()] &&
                      request[req.toLowerCase()]['errors'] &&
                      Object.keys(request[req.toLowerCase()]['errors']).length > 0 && (
                        <i className="bi bi-exclamation-circle mx-2" style={{ color: 'red' }}></i>
                      )}
                </div>

                <div>
                  {req === 'Headers' && (
                    <i
                      className="bi bi-plus-circle mx-1"
                      width="25"
                      height="25"
                      onClick={(e) => addProperty(e, req.toLowerCase())}
                    ></i>
                  )}
                  <i
                    className="bi bi-pencil-square mx-1"
                    alt="edit"
                    height={25}
                    width={25}
                    onClick={() => toggleProperty(index)}
                  ></i>
                </div>
              </div>
              {expandedProperty === index &&
                (req.toLowerCase() === 'headers' ? (
                  <div className="card-body br-text-primary">
                    <HeadersSetting headerData={request.headers} onChange={onReqChange} />
                  </div>
                ) : req.toLowerCase() === 'url' ? (
                  <div className="card-body br-text-primary">
                    <UrlSettings
                      urlData={request.url}
                      onChange={onReqChange}
                      paramData={request.parameters || []}
                      envVars={envVars}
                      method={request.method}
                      onAdd={addProperty}
                    />
                  </div>
                ) : req.toLowerCase() === 'auth' ? (
                  <div className="card-body br-text-primary">
                    <AuthSettings
                      moduleId={moduleId}
                      authData={request.auth}
                      onChange={onReqChange}
                      apiData={api}
                      onApiChange={onChange}
                    />
                  </div>
                ) : req.toLowerCase() === 'body' ? (
                  <div className="card-body br-text-primary">
                    <BodySettings
                      bodyData={
                        request.body && request.body.length > 0
                          ? request.body[0]
                          : {
                              content_type: '',
                              mode: '',
                              required: false,
                              schema_name: '',
                              schema: {
                                type: 'object',
                                properties: {},
                                required: [],
                              },
                            }
                      }
                      onChange={onReqChange}
                      moduleId={moduleId}
                    />
                  </div>
                ) : null)}
            </div>
          ))}
      </div>
    </div>
  );
}
RequestSettings.propTypes = {
  requestData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  apiData: PropTypes.object,
  isAuthApi: PropTypes.bool,
  title: PropTypes.string,
  requestType: PropTypes.string,
  moduleId: PropTypes.string,
};
export default RequestSettings;
