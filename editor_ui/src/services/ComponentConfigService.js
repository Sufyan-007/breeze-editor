export async function addComponent(name, type, route, projectName) {
  const response = await (
    await fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/add-component/` +
        projectName +
        "/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      }
    )
  ).json();
  // this.dispatch(setConfig(response.config)) : need to handle this in the component itself now
  if (route) {
    console.log("Hello there!");
    await addRoute({ path: route, component: response.comp }, projectName);
  }
  return response;
}

export async function addRoute(routeObj, projectName) {
  console.log(routeObj);
  if (routeObj.path && (routeObj.component || routeObj.redirectTo)) {
    const response = await fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/add-route/` +
        projectName +
        "/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeObj),
      }
    );
    console.log(response);
    const jsonData = await response.json();
    console.log(response.status);
    console.log(jsonData);
    return { body: jsonData, status: response.status };
  }
}

export async function saveAllRoutes(allRoutes, projectName) {
  console.log(allRoutes);
  const response = await fetch(
    `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/add-all-routes/` +
      projectName +
      "/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allRoutes }),
    }
  );
  const jsonData = await response.json();
  console.log(response.status);
  console.log(jsonData);
  return { body: jsonData, status: response.status };
}

export async function addChildRoute(childObj, projectName) {
  if (!childObj.path || (!childObj.component && !childObj.redirectTo))
    return { body: "incomplete data provided", status: 400 };
  const resPromise = await fetch(
    `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/add-child-route/${projectName}/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(childObj),
    }
  );

  const response = await resPromise.json();
  return { body: response, status: resPromise.status };
}

export const updateComponentConfig = async (payload) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-component-config/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating component config:", error);
    throw error;
  }
};

export const reorderComponentActions = async (payload) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/reorder-component-actions/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating component config:", error);
    throw error;
  }
};
