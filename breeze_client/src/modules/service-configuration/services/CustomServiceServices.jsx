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
  });
  await Promise.all(promises);
  return res;
}

export async function getFunctions(projectName, payload) {
  const res = await fetchIntermediates(projectName, payload);
  const functionsResponse = {};

  const modulePromises = Object.keys(res.data).map(async (moduleId) => {
    const { data } = await fetchIntermediates(projectName, { ...payload, module: moduleId });
    const filePromises = Object.keys(data).map(async (fileId) => {
      const { data } = await fetchIntermediates(projectName, { ...payload, module: moduleId, files: fileId });
      Object.entries(data).forEach(([key, value]) => {
        functionsResponse[key] = value;
      });
    });

    await Promise.all(filePromises);
  });
  await Promise.all(modulePromises);
  return functionsResponse;
}

// export async function getAuthFunctions(projectName, payload) {
//   const res = await fetchIntermediates(projectName, payload);
//   const promises = Object.keys(res.data).map(async (([moduleId, value])) => {
//   });
//   await Promise.all(promises);
//   return res;
// }
