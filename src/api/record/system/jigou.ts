import { defHttp } from '/@/utils/http/axios'
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from '/@/api/sys/model/menuModel'

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getJigouListById() {
  return defHttp.request({
    url: '/sys/jigou/list',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveJigou(params) {
  return defHttp.request({
    url: '/sys/jigou',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteJigou(id) {
  return defHttp.request({
    url: '/sys/jigou?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
