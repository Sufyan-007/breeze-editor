const HOST="http://localhost:8000"

export async function fetchIntermediate(projectName) {
    const result = await (await fetch(HOST+"/api-client-generator/fetch-all-intermediates/" + projectName+"/false")).json()
    return result
}

export async function fetchIntermediateFilenames(projectName) {
    const result = await (await fetch(HOST+"/api-client-generator/fetch-all-intermediates/" + projectName+"/true")).json()
    return result
}

export async function generateReactService(projectName,filename) {
    let path = "ORDINARY"
    if (filename == "auth.json"){
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