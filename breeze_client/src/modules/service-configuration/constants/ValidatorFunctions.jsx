// Helper function to check if required object properties are present
const hasRequiredProps = (obj, props) => {
  return props.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop));
};
export const isValidApiStructure = (api, isAuthApi) => {
  if (!api) return false;
  console.log(api);

  // Check basic API structure
  if (!hasRequiredProps(api, ['operation_id', 'request', 'response'])) return false;

  // Check authentication API structure
  if (!isAuthApi && !api.tags) return false;

  // Check request properties
  if (!isValidRequestStructure(api.request)) return false;

  // Check response structure
  if (!isValidResponseStructure(api.response)) return false;

  return true;
};

// Helper function to validate request structure
const isValidRequestStructure = (request) => {
  if (!request) return false;

  // Validate main request properties
  if (!hasRequiredProps(request, ['method', 'url', 'parameters'])) return false;

  const { method, url, parameters } = request;

  // Validate URL properties
  if (!url.path || !url.baseurl || !Array.isArray(url.path)) return false;

  // Validate each parameter in the request
  if (!Array.isArray(parameters)) return false;
  if (parameters.length > 0) {
    if (!validateRequestParameters(parameters)) return false;
  }

  // If it's not a GET request, validate body properties
  if (method !== 'GET' && !validateRequestBody(request.body)) return false;

  return true;
};

// Helper function to validate request parameters
const validateRequestParameters = (parameters) => {
  return parameters.every((param) => hasRequiredProps(param, ['param_in', 'name', 'type', 'param_type']));
};

// Helper function to validate request body
const validateRequestBody = (body) => {
  return body.every((b) => hasRequiredProps(b, ['content_type', 'mode']));
};

// Helper function to validate response structure
const isValidResponseStructure = (response) => {
  if (!Array.isArray(response)) return false;
  return response.every((resp) => hasRequiredProps(resp, ['content_type', 'status']));
};
