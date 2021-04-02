import request from '../utils/request'

export function modifyUser(url,options){
    return request({
        method:'GET',
        url:url,
        params:options
    })
}