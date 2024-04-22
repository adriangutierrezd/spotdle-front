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