import { fetchIntermediates } from './IntermediateServices';

export async function getModules(projectName, payload) {
  const res = await fetchIntermediates(projectName, payload);
  const promises = Object.keys(res.data).map(async (moduleId) => {
    const { data } = await fetchIntermediates(projectName, { ...payload, module: moduleId });
    res.data[moduleId]['files'] = Object.keys(data);
  });
  await Promise.all(promises);
  return res;
}

export async function getFiles(projectName, payload) {
  const res = await fetchIntermediates(projectName, payload);
  const promises = Object.keys(res.data).map(async (fileId) => {
    const { data } = await fetchIntermediates(projectName, { ...payload, files: fileId });
    res.data[fileId]['functions'] = Object.keys(data);
    res.data[fileId]['module_id'] = payload.module;
  });
  await Promise.all(promises);
  return res;
}

export async function getFunctions(projectName, payload) {
  const functionsResponse = {};
  const { data } = await fetchIntermediates(projectName, payload);
  Object.entries(data).forEach(([key, value]) => {
    functionsResponse[key] = value;
    functionsResponse[key]['file_id'] = payload.files;
    functionsResponse[key]['module_id'] = payload.module;
  });

  return functionsResponse;
}

// export async function getAuthFunctions(projectName, payload) {
//   const res = await fetchIntermediates(projectName, payload);
//   const promises = Object.keys(res.data).map(async (([moduleId, value])) => {
//   });
//   await Promise.all(promises);
//   return res;
// }
