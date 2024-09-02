import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL = process.env.REACT_APP_BREEZE_BACKEND_HOST

export async function appendToAuthApi(authObj, update, appName, moduleId) {
  // console.log(moduleId, "moduleid befor call");
  let operation = "add";
  if (update) {
    operation = "update";
  }
  let apiUrl =
    BASE_URL +
    "/api-client-generator/append-to-auth-api/" +
    operation +
    "/" +
    appName
    + "/" + moduleId;
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
export async function getAuthFileApis(projectName, apiId, moduleId) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-auth-file/" +
    projectName +
    "/" +
    apiId
    +
    "/"
    +
    moduleId;
  const auth_apis = await callApiClientGenerator(
    apiUrl,
    "GET",
    null,
    false,
    {}
  );
  return auth_apis;
}
