export async function saveRoute(routeObj, projectName) {
  console.log(routeObj);
  const response = await fetch(
    `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/handle-base-route/` +
      projectName +
      "/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routeObj),
    }
  );
  console.log(response);
  if (response.status.toString().startsWith('5')) {
    return { body: 'something went wrong', status: response.status };
  }
  const jsonData = await response.json();
  console.log(response.status);
  console.log(jsonData);
  return { body: jsonData, status: response.status };
}

export async function deleteRoute(route, projectName) {
  const resPromise = await fetch(
    `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/handle-base-route/${projectName}/`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route),
    }
  );

  const response = await resPromise.json();
  return { body: response, status: resPromise.status };
}
