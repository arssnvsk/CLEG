import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://core.chainoflegends.com/api/v1',
    headers: {
        'content-type': 'application/json'
    }
})


axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
)

export default axiosInstance