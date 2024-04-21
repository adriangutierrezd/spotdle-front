interface Props {
    name: string,
    email: string,
    password: string
}

export const signUpService = async({ email, name, password }:Props) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ email, name, password });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, requestOptions)
    const data = await response.json()

    data.status = response.status
    return data
}