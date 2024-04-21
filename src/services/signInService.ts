interface Props {
    email: string,
    password: string
}

export const signInService = async({ email, password }:Props) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ email, password });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, requestOptions)
    const data = await response.json()
    return data
}