

export async function updateComponent(data) {
    const result = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/write-config/` + this.projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
    )).json()
    return result
}