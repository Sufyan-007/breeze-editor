const HOST="http://localhost:8000"

export async function fetchIntermediate(projectName) {
    const result = await (await fetch(HOST+"/api-client-generator/fetch-all-intermediates/" + projectName+"/false")).json()
    return result
}

export async function fetchIntermediateFilenames(projectName) {
    const result = await (await fetch(HOST+"/api-client-generator/fetch-all-intermediates/" + projectName+"/true")).json()
    return result
}
export async function getAuthFileConfig(projectName) {
    const auth_apis = await (
        await fetch("http://localhost:8000/api-client-generator/fetch-auth-file/" + projectName)
    ).json();
    return auth_apis
}

export async function getAuthApiConfig(projectName,apiId) {
    const auth_api = await (
        await fetch("http://localhost:8000/api-client-generator/fetch-auth-file/" + projectName+"?api_id="+apiId)
    ).json();
    return auth_api
}

export async function generateReactService(projectName,filename) {
    let path = "ORDINARY"
    if (filename === "auth.json"){
        path = "AUTH"
    }
    let file = filename.split(".")[0];
    let apiUrl = HOST+"/api-client-generator/generate-react-api-client/"+path
    const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            "appName" : "creator",
            "filename" : file
        })
      });
    
    const result = await res.json()
    return result
}

export async function appendToAuthApi(authObj,update) {
    let operation = "add";
    if (update){
        operation = "update";
    }
    let apiUrl = HOST+"/api-client-generator/append-to-auth-api/"+operation
    const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(authObj)
      });
    
    const result = await res.json()
    return result
}