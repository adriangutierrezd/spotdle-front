import { getHeaders } from '@/constants';

export const storeTask = async ({token, props}:  {readonly token: string, readonly props: object}) => {
    const myHeaders = getHeaders(token)

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(props)
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, requestOptions)
    const data = await response.json()
    return data
}

export const updateTask = async ({token, taskId, props}:  {readonly token: string, readonly taskId: number, readonly props: object}) => {
    const myHeaders = getHeaders(token)

    const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(props)
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, requestOptions)
    const data = await response.json()
    return data
}

export const getTasks = async ({token}:  {readonly token: string}) => {
    const myHeaders = getHeaders(token)

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, requestOptions)
    const data = await response.json()
    return data
}

export const deleteTask = async ({token, taskId}:  {readonly token: string, readonly taskId: number}) => {
    const myHeaders = getHeaders(token)

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, requestOptions)
    const data = await response.json()
    return data
}