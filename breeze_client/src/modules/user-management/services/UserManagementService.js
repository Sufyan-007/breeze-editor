import { callApiClient } from '../../../utils/breezeApiCall';

export const addUser = async (userDetails) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration failed', error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  const url = `${import.meta.env.VITE_BREEZE_BACKEND_HOST}/api/auth/get-user/`;
  try {
    const response = await callApiClient(url, 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};
