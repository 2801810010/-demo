import request from '../utils/request'

export function defineMessage(url, options = {}) {
    // 编辑用户提交请求
    return request.put(
        url,
        options
    )
}