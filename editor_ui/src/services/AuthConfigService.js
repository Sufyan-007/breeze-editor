export async function getAuthFileConfig(projectName) {
    const auth_apis = await (
        await fetch("http://localhost:8000/api-client-generator/fetch-auth-file/" + projectName)
    ).json();
    return auth_apis
}



export async function updateComponent(data) {
    const result = await (await fetch("http://localhost:8000/editor/write-config/" + this.projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
    )).json()
    return result
}