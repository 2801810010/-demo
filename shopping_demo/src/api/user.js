import request from '../utils/request'

export function UserList(options){
    return request({
        method:'GET',
        url:'/users',
        params:options
    })
}