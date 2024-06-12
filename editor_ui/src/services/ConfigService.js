const HOST=`${process.env.REACT_APP_BREEZE_BACKEND_HOST}`

export async function getAppBasicConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-app-basic-config/" + projectName + "/")).json()
    return config
}

export async function getComponentConfig(projectName,componentName) {
    console.log(projectName,componentName)
    const config = await (await fetch(HOST+"/editor/get-components/" + projectName+"/",{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({"componentName":componentName})
    })).json()
    return config
}


export async function getAllComponentConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/get-components/" + projectName+"/")).json()
    return config
}


export async function getRouterConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-router-config/" + projectName + "/")).json()
    return config
}

export async function getServiceConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-services/" + projectName + "/")).json()
    return config
}

export async function getReduxStoreConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-redux-store/" + projectName + "/")).json()
    return config
}

export async function getReducerConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-reducers/" + projectName + "/")).json()
    return config

}

export async function getRunningPort(projectName) {
    const port = await (await fetch(HOST+"/editor/run-project/" + projectName + "/")).json()
    return port.port
}

export async function getAllConfigs(projectName) {
    return {
        appBasicConfig: await getAppBasicConfig(projectName),
        componentConfig: await getAllComponentConfig(projectName),
        routerConfig : await getRouterConfig(projectName),
        serviceConfig : await getServiceConfig(projectName),
        reduxStoreConfig : await getReduxStoreConfig(projectName),
        reducerConfig : await getReducerConfig(projectName),
        port:await getRunningPort(projectName)
    }
}