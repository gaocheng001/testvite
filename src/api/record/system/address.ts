import { defHttp } from '/@/utils/http/axios'
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from '/@/api/sys/model/menuModel'

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getAddressListById() {
  return defHttp.request({
    url: '/address/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveAddress(params) {
  return defHttp.request({
    url: '/address',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteAddress(id) {
  alert(id)
  return defHttp.request({
    url: '/address?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
