import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL =
  process.env.CURRENT_ENV === "dev"
    ? `http://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}`
    : `http://${process.env.REACT_APP_PROD_HOST}:${process.env.REACT_APP_PROD_PORT}`;

export async function addSchema(projectName, SchemaDetails) {
  const apiUrl = BASE_URL + "/api-client-generator/add-schema/" + projectName;
  const result = await callApiClientGenerator(
    apiUrl,
    "POST",
    SchemaDetails,
    false,
    {}
  );
  return result;
}
export async function deleteSchema(projectName, id) {
  const apiUrl = BASE_URL + "/api-client-generator/delete-schema/" + projectName + "/" + id;
  const result = await callApiClientGenerator(
    apiUrl,
    "DELETE",
    null,
    false,
    {}
  );
  return result;
}
export async function editSchema(projectName, SchemaDetails, schemaId) {
  const apiUrl =
    BASE_URL +
    "/api-client-generator/edit-schema/" +
    projectName +
    "/" +
    schemaId;
  const result = await callApiClientGenerator(
    apiUrl,
    "PUT",
    SchemaDetails,
    false,
    {}
  );
  return result;
}

