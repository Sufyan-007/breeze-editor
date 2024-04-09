export async function getAuthFileConfig(projectName) {
    const auth_apis = await (
        await fetch("http://localhost:8000/api-client-generator/fetch-auth-file/" + projectName)
    ).json();
    return auth_apis
}