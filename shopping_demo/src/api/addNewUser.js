import request from '../utils/request';

export function addNewUser(options={}){
    return request({
        method:'POST',
        url:'/users',
        data:options
    })
}