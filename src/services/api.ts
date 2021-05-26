import axios from 'axios';

const api = axios.create({
    baseURL: 'http://172.17.190.113:3333',
})

export default api;