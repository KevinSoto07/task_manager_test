//Configuración de axios
import axios from "axios";

const api = axios.create({
    baseURL: 'https://task-manager-backend-dt8p.onrender.com',
})

//Interceptor: agrega el token automaticamente a cada petición
api.interceptors.request.use((config) =>{
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

//El interceptor es como un middleware pero en el frontend. Cada vez que hagas una petición, axios agrega el token automaticamente sin que tengas que hacerlo manualmente.

export default api;