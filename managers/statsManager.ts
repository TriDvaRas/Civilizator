import api from "../api/api";

export async function submitStats() {
    await api.post(`/submitstats`,{})
    log.info(`Submit Stats done`)
}