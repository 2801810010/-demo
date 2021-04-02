import request from '../utils/request'

export function removeUser(userId){
    return request.delete(userId)
}