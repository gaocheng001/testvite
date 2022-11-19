import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getUserListById() {
  return defHttp.request({
    url: '/oidc/sys/user/list',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveUser(data) {
  return defHttp.request({
    url: '/oidc/sys/user',
    method: 'POST',
    params: data,
    headers: {
      ignoreCancelToken: true
    }
  })
}

// export function deleteUser(id) {
//   return defHttp.request({
//     url: '/sys/user?id=' + id,
//     method: 'DELETE',
//     headers: {
//       ignoreCancelToken: true
//     }
//   })
// }