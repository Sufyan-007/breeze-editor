import { callApiClient } from '../../../utils/breezeApiCall';

const BASE_URL = import.meta.env.VITE_BREEZE_BACKEND_HOST;

export const getAllThirdPartyLibraries = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};

export const getAllCustomComponents = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};

export const getAllCustomZipComponents = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};

export const getAllCustomThirdPartyComponents = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};
export const getLibraryComponents = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};

export const getAllProps = async (projectName, payload) => {
  const url = `${BASE_URL}/api/project/query_resource/${projectName}/`;
  try {
    const response = await callApiClient(url, 'POST', payload);
    return response;
  } catch (error) {
    console.error('Error fetching components:', error.message);
    throw error;
  }
};
