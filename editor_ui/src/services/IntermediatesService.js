import Blocker from "./LoaderService";

const HOST = "http://localhost:8000";

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
    HOST +
    "/api-client-generator/fetch-all-intermediates/" +
    projectName +
    "/false";
  const result = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return result;
}

export async function fetchIntermediateFilenames(projectName) {
  const apiUrl =
    HOST +
    "/api-client-generator/fetch-all-intermediates/" +
    projectName +
    "/true";
  const result = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return result;
}
export async function getAuthFileApis(projectName, apiId) {
  const apiUrl =
    HOST + "/api-client-generator/fetch-auth-file/" + projectName + "/" + apiId;
  const auth_apis = await callApiClientGenerator(
    apiUrl,
    "GET",
    null,
    false,
    {}
  );
  return auth_apis;
}

export async function getAuthApiConfig(projectName, apiId) {
  const apiUrl =
    HOST + "/api-client-generator/fetch-auth-file/" + projectName + "/" + apiId;
  const auth_api = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return auth_api;
}

export async function modifyApiConfig(data, projectName, filename, operation) {
  filename = filename.replace(/\.json$/, "");
  const apiUrl =
    "http://127.0.0.1:8000/api-client-generator/modified-intermediate-json/" +
    projectName +
    "/" +
    filename +
    "/" +
    operation;
  const response = await callApiClientGenerator(
    apiUrl,
    "POST",
    data,
    false,
    {}
  );
  // const responseData = await response.json();
  return response;
}
export async function getApiConfig(projectName, filename, apiId) {
  filename = filename.replace(/\.json$/, "");
  const apiUrl =
    HOST +
    "/api-client-generator/fetch-api-config/" +
    projectName +
    "/" +
    filename +
    "/" +
    apiId;
  const auth_api = await callApiClientGenerator(apiUrl, "GET", null, false, {});
  return auth_api;
}

export async function generateReactService(projectName, filename) {
  console.log(filename,"jjiiiiiiiiiiii");
  let path = "ORDINARY";
  if (filename === "auth") {
    path = "AUTH";
  } else {
    if (filename.includes("Websocket")) {
      path = "WS";
    }
  }
  let file = filename.split(".")[0];
  let apiUrl = HOST + "/api-client-generator/generate-react-api-client/" + path;
  const res = callApiClientGenerator(
    apiUrl,
    "POST",
    { appName: projectName, filename: file },
    false,
    {}
  );
  return res;
}

export async function appendToAuthApi(authObj, update, appName) {
  let operation = "add";
  if (update) {
    operation = "update";
  }
  let apiUrl =
    HOST +
    "/api-client-generator/append-to-auth-api/" +
    operation +
    "/" +
    appName;
  const res = await callApiClientGenerator(apiUrl, "POST", authObj, false, {});
  return res;
}
export async function transferToAuthApi(authObj, appName) {
  let apiUrl = HOST + "/api-client-generator/transfer-to-auth-api/" + appName;
  const res = await callApiClientGenerator(apiUrl, "POST", authObj, false, {});
  return res;
}
export async function callApiClientGenerator(
  url,
  method,
  payload,
  isFormData,
  options = {}
) {
  const { headers = {}, ...otherOptions } = options;
  const loader = new Blocker("Loading...");

  try {
    const requestOptions = {
      method: method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }), // Set for JSON only
        ...headers,
      },
      ...(isFormData
        ? { body: payload }
        : payload && { body: JSON.stringify(payload) }),
      ...otherOptions,
    };
    loader.show();

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
  } finally {
    loader.hide();
  }
}
