export async function addComponent(name, type, route,projectName) {

    const response = await (await fetch("http://localhost:8000/editor/add-component/" + projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name , type }) }
    )).json()
    // this.dispatch(setConfig(response.config)) : need to handle this in the component itself now
    if (route) {
        console.log("Hello there!")
         await saveRoute({route, component: response.comp}, projectName)
    }
    return response
}

export async function saveRoute(routeObj, projectName) {
    console.log(routeObj)
    if (routeObj.path && (routeObj.component || routeObj.redirectTo) ) {
        const response = await fetch(`http://localhost:8000/editor/handle-base-route/` + projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( routeObj ) }
        )
        console.log(response)
        const jsonData = await response.json();
        console.log(response.status);
        console.log(jsonData);
        return { body: jsonData , status: response.status}
    }
}

export async function deleteBaseRoute(route, projectName) {
    const resPromise = await fetch(`http://localhost:8000/editor/handle-base-route/${projectName}/`,
        {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(route) 
        }
    )

    const response = await resPromise.json()
    return { body: response , status: resPromise.status}
}

export async function addChildRoute(childObj, projectName) {
    if (!childObj.path || (!childObj.component && !childObj.redirectTo)) 
        return {body: 'incomplete data provided', status: 400}
    const resPromise = await fetch(`http://localhost:8000/editor/handle-child-route/${projectName}/`,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(childObj) 
        }
    )

    const response = await resPromise.json()
    return { body: response , status: resPromise.status}
}

export async function editChildRoute(childObj, projectName) {
    if (!childObj.path || (!childObj.component && !childObj.redirectTo)) 
        return {body: 'incomplete data provided', status: 400}
    const resPromise = await fetch(`http://localhost:8000/editor/handle-child-route/${projectName}/`,
        {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(childObj) 
        }
    )

    const response = await resPromise.json()
    return { body: response , status: resPromise.status}
}

export async function deleteChildRoute(route, projectName) {
    const resPromise = await fetch(`http://localhost:8000/editor/handle-child-route/${projectName}/`,
        {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(route) 
        }
    )

    const response = await resPromise.json()
    return { body: response , status: resPromise.status}
}