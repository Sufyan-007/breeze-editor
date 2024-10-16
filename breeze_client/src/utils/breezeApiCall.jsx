import { BreezeLoader, BreezeToaster } from '../common/display';
import { createRoot } from 'react-dom/client';

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export async function callApiClient(
  url,
  method = 'GET',
  payload = null,
  isFormData = false,
  options = {},
  loader = true,
  showToaster = true
) {
  const { headers = {}, ...otherOptions } = options;
  const accessToken = getAccessToken();

  let loaderContainer = null;
  let root = null;
  let toasterContainer = null;
  let toasterRoot = null;

  if (loader) {
    loaderContainer = document.createElement('div');
    document.body.appendChild(loaderContainer);
    root = createRoot(loaderContainer);
  }

  toasterContainer = document.createElement('div');
  document.body.appendChild(toasterContainer);
  toasterRoot = createRoot(toasterContainer);

  try {
    if (loader) {
      root.render(<BreezeLoader />);
    }

    const requestOptions = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(isFormData ? { body: payload } : payload && { body: JSON.stringify(payload) }),
      ...otherOptions,
    };

    const response = await fetch(url, requestOptions);
    console.log(response);
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const responseData = await response.json();

    if (showToaster && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
      toasterRoot.render(<BreezeToaster message="Operation successful!" type="success" />);
    }

    return responseData;
  } catch (error) {
    console.error('API call error:', error);

    if (showToaster && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
      toasterRoot.render(<BreezeToaster message="Operation failed. Please try again." type="error" />);
    }

    throw error;
  } finally {
    if (loader) {
      root.unmount();
      document.body.removeChild(loaderContainer);
    }

    if (toasterRoot) {
      setTimeout(() => {
        toasterRoot.unmount();
        document.body.removeChild(toasterContainer);
      }, 3000);
    }
  }
}
