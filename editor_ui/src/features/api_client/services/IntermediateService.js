import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL =
  process.env.CURRENT_ENV === "dev"
    ? `http://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}`
    : `http://${process.env.REACT_APP_PROD_HOST}:${process.env.REACT_APP_PROD_PORT}`;
export async function generateIntermediates(fileType, appName, formData) {
  let apiUrl = `http://127.0.0.1:8000/api-client-generator/convert-standard-json/${fileType}/${appName}`;
  const response = await callApiClientGenerator(
    apiUrl,
    "POST",
    formData,
    true,
    {}
  );
  return response;
}
export async function fetchIntermediate(projectName) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-all-intermediates/" +
    projectName +
    "/false";
  const result = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return result;
}
export async function fetchIntermediateFilenames(projectName) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-all-intermediates/" +
    projectName +
    "/true";
  const result = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return result;
}
