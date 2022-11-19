import { defHttp } from '/@/utils/http/axios'
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from '/@/api/sys/model/menuModel'

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getBaseInfoListById() {
  return defHttp.request({
    url: '/base/info/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveBaseInfo(params:any) {
  return defHttp.request({
    url: '/base/info',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteBaseInfo(params:any) {
  return defHttp.request({
    url: '/base/info?',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteColumn(id:any) {
  return defHttp.request({
    url: '/base/info/deleteColumn?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
