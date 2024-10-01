import { BreezeLoader } from '../common/display';
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
  loader = true
) {
  const { headers = {}, ...otherOptions } = options;
  const accessToken = getAccessToken();

  let loaderContainer = null;
  let root = null;

  if (loader) {
    loaderContainer = document.createElement('div');
    document.body.appendChild(loaderContainer);
    root = createRoot(loaderContainer);
  }

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

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  } finally {
    if (loader) {
      root.unmount();
      document.body.removeChild(loaderContainer);
    }
  }
}
