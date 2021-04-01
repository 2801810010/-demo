import axios from 'axios';

let instance = axios.create({
    baseURL:"http://127.0.0.1:8888/api/private/v1/",
})

// 请求拦截器
instance.interceptors.request.use(config=>{
    return config
})
// 响应拦截器
instance.interceptors.response.use(response=>{
    let data = response.data;
    return data
})

export default instance;
