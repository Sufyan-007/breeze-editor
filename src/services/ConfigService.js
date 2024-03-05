const HOST="http://localhost:8000"

export async function getComponentConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-config/" + projectName)).json()
    return config
}

export async function getRouterConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-router-config/" + projectName)).json()
    return config
}

export async function getServiceConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-services/" + projectName)).json()
    return config
}

export async function getReduxStoreConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-redux-store/" + projectName)).json()
    return config
}

export async function getReducerConfig(projectName) {
    const config = await (await fetch(HOST+"/editor/read-reducers/" + projectName)).json()
    return config

}

export async function getAllConfigs(projectName) {
    return {
        componentConfig: await getComponentConfig(projectName),
        routerConfig : await getRouterConfig(projectName),
        serviceConfig : await getServiceConfig(projectName),
        reduxStoreConfig : await getReduxStoreConfig(projectName),
        reducerConfig : await getReducerConfig(projectName) 
    }
}