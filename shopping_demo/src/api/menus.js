import request from '../utils/request.js'

export function menus(options={}){
    return request({
        method:'GET',
        url:'/menus',
        params:options
    })
}
