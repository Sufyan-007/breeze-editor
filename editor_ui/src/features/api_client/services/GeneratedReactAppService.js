import { callApiClientGenerator } from "../../../common/api_call/apiClientGenerator";
const BASE_URL = process.env.REACT_APP_BREEZE_BACKEND_HOST

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
