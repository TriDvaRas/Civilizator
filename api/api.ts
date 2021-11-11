import axios, { AxiosError } from "axios"
axios.defaults.headers.common = {
    "Content-Type": "application/json"
}
const baseEndpoint = `http://localhost:3425`
export default {
    get, post, put, patch, delete: del, version
}
export async function version() {
    try {
        return (await axios.get(`${baseEndpoint}/version`)).data
    } catch (error: any) {
        logAxiosError(error)
    }
}
export async function get(path: `/${string}`) {
    try {
        return (await axios.get(`${baseEndpoint}/bot${path}`)).data
    } catch (error: any) {
        logAxiosError(error)
        throw error
    }
}
export async function post(path: `/${string}`, data: { [key: string]: any }) {
    try {
        return (await axios.post(`${baseEndpoint}/bot${path}`, data)).data
    } catch (error: any) {
        logAxiosError(error)
        throw error
    }
}
export async function put(path: `/${string}`, data: { [key: string]: any }) {
    try {
        return (await axios.put(`${baseEndpoint}/bot${path}`, data)).data
    } catch (error: any) {
        logAxiosError(error)
        throw error
    }
}
export async function patch(path: `/${string}`, data: { [key: string]: any }) {
    try {
        return (await axios.patch(`${baseEndpoint}/bot${path}`, data)).data
    } catch (error: any) {
        logAxiosError(error)
        throw error
    }
}
export async function del(path: `/${string}`) {
    try {
        return (await axios.delete(`${baseEndpoint}/bot${path}`)).data
    } catch (error: any) {
        logAxiosError(error)
        throw error
    }
}

function logAxiosError(err: AxiosError) {
    if (err.response?.status)
        log.error(`${err.response?.status} at ${err.request.path} - ${typeof err.response?.data === 'string' ? err.response?.data : JSON.stringify(err.response?.data)}`)
    else
        log.error(`Civilizator API is not responding`)
}