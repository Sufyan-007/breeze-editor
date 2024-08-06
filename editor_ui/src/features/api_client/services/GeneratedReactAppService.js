import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL =
  process.env.CURRENT_ENV === "dev"
    ? `http://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}`
    : `http://${process.env.REACT_APP_PROD_HOST}:${process.env.REACT_APP_PROD_PORT}`;
export async function generateReactService(type,projectName, filename, moduleId) {
  let path = type;
 
  let file = filename.split(".")[0];
  let apiUrl = BASE_URL + "/api-client-generator/generate-react-api-client/" + path;
  const res = callApiClientGenerator(
    apiUrl,
    "POST",
    { appName: projectName, filename: file, moduleId: moduleId },
    false,
    {}
  );
  return res;
}
