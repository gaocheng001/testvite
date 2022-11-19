import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getRoleListById() {
  return defHttp.request({
    url: '/sys/role/list',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function saveRole(params) {
  return defHttp.request({
    url: '/sys/role',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteRole(id) {
  return defHttp.request({
    url: '/sys/role?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
