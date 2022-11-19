import { defHttp } from '/@/utils/http/axios'
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from '/@/api/sys/model/menuModel'

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getMenuListById() {
  return defHttp.request({
    url: '/sys/menu/list',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveMenu(params) {
  return defHttp.request({
    url: '/sys/permission',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteMenu(id) {
  return defHttp.request({
    url: '/sys/menu?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
