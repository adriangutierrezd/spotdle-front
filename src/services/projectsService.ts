export const getProjects = async ({token}: { readonly token: string }) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, requestOptions)
    const data = await response.json()
    return data
}

export const storeProject = async ({token, props}:  {readonly token: string, readonly props: object}) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(props)
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, requestOptions)
    const data = await response.json()
    return data
}

export const deleteProject = async ({token, projectId}: {readonly token: string, readonly projectId: number}) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, requestOptions)
    const data = await response.json()
    return data
}

export const updateProject = async ({token, projectId, name, color}:  {readonly token: string, readonly projectId: number, readonly name: string, readonly color: string}) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${token}`)

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({
            name,
            color
        })
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, requestOptions)
    const data = await response.json()
    return data
}