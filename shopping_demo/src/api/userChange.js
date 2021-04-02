import request from '../utils/request'

export function userChangeState(url){
    return request.put(url)
}