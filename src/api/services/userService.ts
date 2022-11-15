// @ts-ignore
import api from '../http/index.ts'

export default {
    async playerInfo() {
        return api.get('/player')
    },
    async playerLand() {
        return api.get('/playerland')
    }
}