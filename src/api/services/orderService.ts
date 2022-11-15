
// @ts-ignore
import api from '../http/index.ts'

export default {
    async obtainOrders() {
        return api.get('/land/2/orders')
    }
}