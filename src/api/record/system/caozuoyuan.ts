import { defHttp } from '/@/utils/http/axios'
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from '/@/api/sys/model/menuModel'

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getPsnTypeListById() {
  return defHttp.request({
    url: '/sys/user/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveCao(params) {
  return defHttp.request({
    url: '/sys/user',
    method: 'POST',
    params
  })
}

export function deletById(id) {
  return defHttp.request({
    url: '/sys/user?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function updateFlag(id, flag) {
  return defHttp.request({
    url: '/sys/user/updateFlag/' + id +'/'+ flag,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
