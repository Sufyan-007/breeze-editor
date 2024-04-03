const HOST="http://localhost:8000"

export async function fetchIntermediate(projectName) {
    const result = await (await fetch(HOST+"/api-client-generator/fetch-all-intermediates/" + projectName)).json()
    return result
}