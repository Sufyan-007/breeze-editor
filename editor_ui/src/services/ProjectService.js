export async function createNewProject(formData){
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/new-project/`,
            { method: "POST", body: formData }
        )).json()
    return response
}

export async function reGenerateProject(projectName){
    const respnse = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-project/`+projectName+"/",
        {method:"PUT",headers: { 'Content-Type': 'application/json' }}
    )).json()
    return respnse
}

export async function deleteProject(projectName){
    const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/delete-project/`+projectName+"/",
        {method:"DELETE",headers: { 'Content-Type': 'application/json' }}
    )
    const status = response.status
    const body = await response.json()
    await new Promise(r => setTimeout(r, 2000));
    return {status,body}
}

export async function updateProject(formData) {
    const response = await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-project-details/`,
        { method: "PUT", body: formData }
    );
    const status = response.status;
    const body = await response.json();
    return { status, body };
}
