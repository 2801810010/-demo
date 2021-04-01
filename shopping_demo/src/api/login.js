import request from '../utils/request'

export function login_(options={}){
    return request({
        method:'POST',
        url:"/login",
        data:options
    })
}