export async function getServiceConfig(projectName) {
    const services = await (
        await fetch("http://localhost:8000/editor/read-services/" + projectName)
    ).json();
    return services
}

export async function updateServiceConfig(projectName, serviceConfig) {
    const services = await (
        await fetch("http://localhost:8000/editor/write-services/" + projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' } , body: JSON.stringify(serviceConfig)}
        )
    ).json();
    return services
}