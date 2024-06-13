import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL =
  process.env.CURRENT_ENV === "dev"
    ? `http://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}`
    : `http://${process.env.REACT_APP_PROD_HOST}:${process.env.REACT_APP_PROD_PORT}`;

export async function getApiConfig(projectName, filename, apiId) {
  filename = filename.replace(/\.json$/, "");
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-api-config/" +
    projectName +
    "/" +
    filename +
    "/" +
    apiId;
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
  return response;
}

export async function getApiSchemaDetails(projectName, schemaName) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-schema-details/" +
    projectName +
    "/" +
    schemaName;
  const schema_details = await callApiClientGenerator(
    apiUrl,
    "GET",
    null,
    false,
    {}
  );
  return schema_details.data;

}

export async function getApiSchemaProperties(projectName, schemaName, property) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/fetch-schema-properties/" +
    projectName +
    "/" +
    schemaName + 
    "/" +
    property;
  const schema_details = await callApiClientGenerator(
    apiUrl,
    "GET",
    null,
    false,
    {}
  );
  // console.log(schema_details, "result");
  return schema_details.data;

}
