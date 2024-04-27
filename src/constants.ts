
export const AVAILABLE_COLORS: Array<string> = [
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ff8b94',
    '#bae1ff',
    '#ffffba',
    '#e0d6ff',
    '#5a5255',
    '#559e83',
    '#1b85b8'
]

export const CORRECT_TOAST_TITLE = "Correcto"
export const ERROR_TOAST_TITLE = "Error"
export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const GENERAL_ERROR_MESSAGE = "Ha ocurrido un error inesperado"

export const getHeaders = (token: string | null): Headers => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if(token) {
        myHeaders.append('Authorization', `Bearer ${token}`)
    }
    myHeaders.append('Accept', 'application/json')
    return myHeaders
}