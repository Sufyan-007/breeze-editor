import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL =
  process.env.CURRENT_ENV === "dev"
    ? `http://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}`
    : `http://${process.env.REACT_APP_PROD_HOST}:${process.env.REACT_APP_PROD_PORT}`;
export async function appendToAuthApi(authObj, update, appName) {
  let operation = "add";
  if (update) {
    operation = "update";
  }
  let apiUrl =
    BASE_URL +
    "/api-client-generator/append-to-auth-api/" +
    operation +
    "/" +
    appName;
  const res = await callApiClientGenerator(apiUrl, "POST", authObj, false, {});
  return res;
}

export async function transferToAuthApi(authObj, appName) {
  let apiUrl =
    BASE_URL + "/api-client-generator/transfer-to-auth-api/" + appName;
  const res = await callApiClientGenerator(apiUrl, "POST", authObj, false, {});
  return res;
}

export async function getAuthApiConfig(projectName, apiId) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-auth-file/" +
    projectName +
    "/" +
    apiId;
  const auth_api = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return auth_api;
}
export async function getAuthFileApis(projectName, apiId) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-auth-file/" +
    projectName +
    "/" +
    apiId;
  const auth_apis = await callApiClientGenerator(
    apiUrl,
    "GET",
    null,
    false,
    {}
  );
  return auth_apis;
}
