import { BreezeLoader, BreezeToaster } from '../common/display';
import { createRoot } from 'react-dom/client';
import { router } from '../routes/routing';

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

    let responseData = await response.json();
    const refresh_token = localStorage.getItem('refreshToken');

    // if refresh token not available in localstorage
    if (!refresh_token) {
      console.log('asd');
      router.navigate('/login');
    } else if (responseData.error === 'access token expired') {
      //get new access token from current refresh token
      const response = await fetch(`${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/auth/refreshtoken/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token,
        }),
      });

      const data = await response.json();

      // when refresh token expired it will redirect to login page
      if (data.error === 'refresh token expired') {
        router.navigate('/login');
      }

      // store new generated accesstoken in localstorage
      localStorage.setItem('accessToken', data.accessToken);

      // hit last api again with same payload and method
      responseData = await callApiClient(url, method, payload, isFormData, options, loader, showToaster);
      // window.location.reload();
    } else {
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      if (showToaster && ['PUT', 'POST', 'DELETE'].includes(method.toUpperCase())) {
        toasterRoot.render(<BreezeToaster message="Operation successful!" type="success" />);
      }
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
