export async function addComponent(name, type, route,projectName) {

    const response = await (await fetch("http://localhost:8000/editor/add-component/" + projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name , type }) }
    )).json()
    // this.dispatch(setConfig(response.config)) : need to handle this in the component itself now
    if (route) {
        console.log("Hello there!")
         await addRoute({path:route, component: response.comp}, projectName)
    }
    return response
}

export async function addRoute(routeObj, projectName) {
    console.log(routeObj)
    if (routeObj.path && (routeObj.component || routeObj.redirectTo) ) {
        const response = await fetch(`http://localhost:8000/editor/add-route/` + projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( routeObj ) }
        )
        console.log(response)
        const jsonData = await response.json();
        console.log(response.status);
        console.log(jsonData);
        return { body: jsonData , status: response.status}
    }
}

export async function saveAllRoutes(allRoutes, projectName) {
    console.log(allRoutes);
    const response = await fetch(`http://localhost:8000/editor/add-all-routes/` + projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ allRoutes }) 
    })
    const jsonData = await response.json();
    console.log(response.status);
    console.log(jsonData);
    return { body: jsonData , status: response.status}
}

export async function addChildRoute(childObj, projectName) {
    if (!childObj.path || (!childObj.component && !childObj.redirectTo)) 
        return {body: 'incomplete data provided', status: 400}
    const resPromise = await fetch(`http://localhost:8000/editor/add-child-route/${projectName}/`,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(childObj) 
        }
    )

    const response = await resPromise.json()
    return { body: response , status: resPromise.status}
}